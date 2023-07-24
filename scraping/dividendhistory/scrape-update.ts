import puppeteer from 'puppeteer';
import { cheerio } from 'cheerio';
import { Dividend } from './types.ts';
import { Stock } from '../../src/db/models/Stock.ts';
import { Dividend as DividendORM } from '../../src/db/models/Dividend.ts';

interface StockUpdateSummary {
  id: number;
  name: string;
  addedDividendCount: number;
}

const updatedStocks: StockUpdateSummary[] = [];
let addedDividends = 0;

// 12 stocks
const stocksToScrape = [
  // Armour Residential REIT
  'ARR',
  // AGNC Investment
  'AGNC',
  // Arbor Realty Trust
  'ABR',
  // BlackRock TCP
  'TCPC',
  // Medical Properties Trust
  'MPW',
  // AT&T
  'T',
  // Devon Energy
  'DVN',
  // Kohl's
  'KSS',
  // Altria
  'MO',
  // B&G Foods
  'BGS',
  // British American Tobacco
  'BTI',
  // Verizon
  'VZ',
];
export const dividendRowColumnNames = [
  'ex_dividend_date',
  'payout_date',
  'cash_amount',
  'info',
] as const;

const browser = await puppeteer.launch({ headless: true });

console.log('UPDATE Crawl start');
const start = performance.now();

for (let index = 0; index < stocksToScrape.length; index++) {
  const currentStock = stocksToScrape[index];
  const stockId = index + 1;
  const url = `https://dividendhistory.org/payout/${currentStock}/`;

  try {
    const page = await browser.newPage();

    // 1) go to summary page of the stock
    await page.goto(url, { waitUntil: 'networkidle0' });

    const htmlPage = await page.content();
    const $ = cheerio.load(htmlPage);

    // Check if the stock is out of date
    const last_updated = $('.col-md-8.col-xs-12.col-sm-12')
      .find('p')
      .filter((_, el) => $(el).text().includes('Updated: '))
      .text()
      .split(': ')[1];

    const stockToUpdate = Stock.findById(stockId).get();

    // @ts-expect-error dunno ts
    if (stockToUpdate.last_updated.includes(last_updated)) {
      // @ts-expect-error dunno ts
      console.log(`Stock is up to date: ${stockToUpdate.stock_full_name}`);

      await page.close();
      continue;
    }

    // @ts-expect-error dunno ts
    console.log(`Stock needs an update: ${stockToUpdate.stock_full_name}`);

    const price = Number(
      $('.col-md-8.col-xs-12.col-sm-12')
        .find('p')
        .filter((_, el) => $(el).text().includes('Last Close Price: $'))
        .text()
        .split('$')[1],
    );
    const next_earnings_date = $('.col-md-8.col-xs-12.col-sm-12')
      .find('p')
      .filter((_, el) => $(el).text().includes('Next Earnings: '))
      .text()
      .split(': ')[1];
    const dividend_yield = Number(
      $('.col-md-8.col-xs-12.col-sm-12')
        .find('p')
        .filter((_, el) => $(el).text().includes('Yield: '))
        .text()
        .split(': ')[1]
        .split('%')[0],
    );
    const market_cap = $('.col-md-8.col-xs-12.col-sm-12')
      .find('p')
      .filter((_, el) => $(el).text().includes('Market Cap: '))
      .text()
      .split(': ')[1];
    const frequency = $('.col-md-8.col-xs-12.col-sm-12')
      .find('p')
      .filter((_, el) => $(el).text().includes('Frequency: '))
      .text()
      .split(': ')[1];

    const updatedStock: StockUpdateSummary = {
      // @ts-expect-error dunno ts
      id: stockToUpdate.id,
      // @ts-expect-error dunno ts
      name: stockToUpdate.stock_full_name,
      addedDividendCount: 0,
    };

    // Updates these values ont the stock
    Stock.updateById(stockId, {
      price,
      market_cap,
      next_earnings_date,
      last_updated,
      frequency,
      dividend_yield,
    });

    // Get the existing dividend data sorted DESCENDING by payout date
    // @ts-expect-error dunno ts
    const dividensInDB = Stock.findById(stockId).dividends();

    // Get all the dividens on the page.
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

    // Loop through the new dividens and check if the payout date already exists in the dividens in the DB
    dividends.forEach((dividend) => {
      if (
        // @ts-expect-error dunno ts
        dividensInDB.some((dbDividend) =>
          dbDividend.payout_date.includes(dividend.payout_date)
        )
      ) {
        return;
      }

      DividendORM.create({
        ex_dividend_date: Math.floor(
          new Date(dividend.ex_dividend_date!).getTime() / 1000,
        ),
        payout_date: Math.floor(
          new Date(dividend.payout_date!).getTime() / 1000,
        ),
        cash_amount: dividend.cash_amount,
        info: dividend.info,
        stock_id: stockId,
      });

      addedDividends++;
      updatedStock.addedDividendCount = updatedStock.addedDividendCount + 1;
      console.log(
        `New payout date. Save dividend in DB: ${dividend.payout_date}`,
      );
    });

    console.log('\n');

    updatedStocks.push(updatedStock);

    await page.close();
  } catch (error) {
    console.log(error);
    await browser.close();
  }
}

const end = performance.now();
console.log(`Execution time: ${Math.floor((end - start) / 1000)} s`);
console.log('UPDATE Crawl end');
console.log(
  `${updatedStocks.length} stocks updated`,
);
console.table(updatedStocks);
console.log(
  `${addedDividends} dividends added`,
);
console.log('\n');

try {
  await browser.close();
} catch (error) {
  console.log((error as Error).message);
}
