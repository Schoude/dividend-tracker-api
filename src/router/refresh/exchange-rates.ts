import puppeteer from 'puppeteer';
import { Router, Status } from 'oak';
import { cheerio } from 'cheerio';
import { supabase } from '../../supabase/client.ts';

const exchangeRatesRefreshRouter = new Router();

const urlExchangeRateUSD_EUR =
  'https://www.comdirect.de/inf/waehrungen/us_dollar-euro-kurs';
const urlExchangeRateEUR_USD =
  'https://www.comdirect.de/inf/waehrungen/euro-us_dollar-kurs';

exchangeRatesRefreshRouter
  .prefix('/api')
  .get('/refresh/exchange-rates', async (context) => {
    const browser = await puppeteer.launch({ headless: true });

    try {
      const page = await browser.newPage();

      // USD / EUR
      await page.goto(urlExchangeRateUSD_EUR);
      let htmlPage = await page.content();
      let $ = cheerio.load(htmlPage);

      const usd_eur = Number(
        $('.realtime-indicator')
          .first()
          .text()
          .replace(',', '.'),
      );

      // EUR / USD
      await page.goto(urlExchangeRateEUR_USD);
      htmlPage = await page.content();
      $ = cheerio.load(htmlPage);

      const eur_usd = Number(
        $('.realtime-indicator')
          .first()
          .text()
          .replace(',', '.'),
      );

      const { data, error } = await supabase.from('exchange_rates')
        .update({ usd_eur, eur_usd })
        .eq('id', 1)
        .select('usd_eur, eur_usd, updated_at');

      if (error) {
        console.log(error);
        context.response.status = Status.InternalServerError;
        context.response.body = {
          error: error.details,
        };

        return;
      }

      context.response.status = Status.OK;
      context.response.body = {
        data,
      };
    } catch (error) {
      console.log(error);
      context.response.status = Status.InternalServerError;
      context.response.body = {
        error: (error as Error).message,
      };
    }
  });

export { exchangeRatesRefreshRouter };
