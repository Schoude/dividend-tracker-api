import puppeteer from 'puppeteer';
import { cheerio } from 'cheerio';
import { extractSymbolName } from '../../src/utils.ts';
import { Dividend, Stock } from '../../src/types.ts';

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
const stocksData: Stock[] = [];
export const dividendRowColumnNames = [
  'ex_dividend_date',
  'payout_date',
  'cash_amount',
  'info',
] as const;

const browser = await puppeteer.launch({ headless: true });

console.log('Crawl start');
const start = performance.now();

for (let index = 0; index < stocksToScrape.length; index++) {
  const currentStock = stocksToScrape[index];
  const url = `https://dividendhistory.org/payout/${currentStock}/`;

  try {
    const page = await browser.newPage();

    // 1) go to summary page of the stock
    await page.goto(url, { waitUntil: 'networkidle0' });

    const htmlPage = await page.content();
    const $ = cheerio.load(htmlPage);

    const stock_full_name = $('h4').text();
    const symbol = extractSymbolName(stock_full_name);
    const last_updated = $('.col-md-8.col-xs-12.col-sm-12')
      .find('p')
      .filter((_, el) => $(el).text().includes('Updated: '))
      .text()
      .split(': ')[1];
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

    const stock: Stock = {
      stock_full_name: stock_full_name.split(' (')[0],
      symbol,
      price,
      market_cap,
      next_earnings_date,
      last_updated,
      frequency,
      dividend_yield,
      dividends: [],
    };

    // Dividend data START

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

    stock.dividends = dividends;

    stocksData.push(stock);

    await page.close();
  } catch (error) {
    console.log(error);
    await browser.close();
  }
}

await Deno.writeTextFile('stocks.json', JSON.stringify(stocksData, null, 2));

const end = performance.now();
console.log(`Execution time: ${Math.floor((end - start) / 1000)} s`);
console.log('Crawl end');

try {
  await browser.close();
} catch (error) {
  console.log((error as Error).message);
}
