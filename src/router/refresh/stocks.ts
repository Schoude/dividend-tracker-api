import { Router, Status } from 'oak';
import { updateStockDetails } from '../../middleware/update-stock-details.ts';
import { supabase } from '../../supabase/client.ts';
import { cheerio } from 'cheerio';
import puppeteer from 'puppeteer';
import { Dividend } from '../../../scraping/dividendhistory/types.ts';
import { extractSymbolName } from '../../../scraping/dividendhistory/utils.ts';

const stocksRefreshRouter = new Router();

stocksRefreshRouter
  .prefix('/api')
  .get('/refresh/stocks/infos', updateStockDetails, (context) => {
    context.response.status = Status.OK;
    context.response.body = {
      message: `Stock Infos updated.`,
    };
  })
  .get(
    '/refresh/stocks/dividends',
    async (context) => {
      const dbStocks = await supabase.from('stocks')
        .select(`
          id,
          isin,
          intl_symbol,
          company_infos (
            name,
            countrycode
          )
        `)
        .neq('intl_symbol', null);

      if (dbStocks.error) {
        console.log(dbStocks.error);
        context.response.status = Status.InternalServerError;
      }

      const stocksToScrape = dbStocks.data
        ?.map((stock) => {
          return {
            name: stock.company_infos!.name,
            intl_symbol: stock.intl_symbol,
            isin: stock.isin,
            id: stock.id,
          };
        })!;

      const browser = await puppeteer.launch({ headless: true });
      const dividendRowColumnNames = [
        'ex_dividend_date',
        'payout_date',
        'cash_amount',
        'info',
      ] as const;

      let scrapedStocks = 0;

      for (let index = 0; index < stocksToScrape.length; index++) {
        console.log(
          `${scrapedStocks + 1}/${stocksToScrape.length}\nScraping: ${
            stocksToScrape[scrapedStocks].name
          }`,
        );

        const currentStock = stocksToScrape[index]!;
        const url =
          `https://dividendhistory.org/payout/${currentStock.intl_symbol}/`;

        scrapedStocks++;

        try {
          const page = await browser.newPage();

          // 1) go to summary page of the stock
          await page.goto(url, { waitUntil: 'networkidle0' });

          const htmlPage = await page.content();
          const $ = cheerio.load(htmlPage);

          const stock_full_name = $('h4').text();
          const symbol = extractSymbolName(stock_full_name);

          if (symbol === '') {
            console.log('Invalid stock', currentStock.isin, currentStock.name);

            continue;
          }

          const dividends: Dividend[] = [];

          $('#dividend_table tbody tr').each((_, row) => {
            const dividend: Dividend = {};

            $(row).find('td').each((i, dataEl) => {
              let data: string | number = $(dataEl).text();

              // cash_amount
              if (i == 2) {
                data = Number(data.split('$')[1].replaceAll('*', ''));
              }

              dividend[dividendRowColumnNames[i]] = data;
            });

            dividends.push(dividend);
          });

          for (const dividend of dividends) {
            const knownDividend = await supabase
              .from('dividends_stock')
              .select('id')
              .eq('isin', currentStock.isin)
              .eq('payment_date_iso', dividend.payout_date)
              .eq('ex_date_iso', dividend.ex_dividend_date);

            if (knownDividend.error || knownDividend.data.length > 0) {
              continue;
            }

            const insert = {
              isin: currentStock.isin,
              info: dividend.info === '' ? null : dividend.info as string,
              amount: Number((dividend.cash_amount as number).toFixed(2)),
              ex_date_iso: dividend.ex_dividend_date as string,
              ex_date_unix: new Date(dividend.ex_dividend_date!).getTime(),
              payment_date_iso: dividend.payout_date as string,
              payment_date_unix: new Date(dividend.payout_date!).getTime(),
              stock_id: currentStock.id!,
            };

            const { error } = await supabase
              .from('dividends_stock')
              .insert(insert);

            if (error) {
              console.log(error);

              context.response.status = Status.InternalServerError;

              return;
            }

            console.log(
              `Dividend inserted: ${currentStock.isin} @ ${dividend.payout_date}`,
            );
          }
          await page.close();
        } catch (error) {
          console.log(error);
          await browser.close();
        }
      }

      // TODO: now get the missing dividends for stocks from trade republic.

      context.response.status = Status.OK;
    },
  );

export { stocksRefreshRouter };
