// Clear all files from content, but don't delete them.

import { bold, green } from 'std/fmt/colors.ts';
import { TR_OUTPUT_FOLDER_PATH } from '../constants.ts';
import { scrapeETFDetails } from './scrape-etf-details.ts';
import { scrapeInstruments } from './scrape-instruments.ts';
import { scrapePortfolio } from './scrape-portfolio.ts';
import { scrapePriceSnapshots } from './scrape-price-snapshots.ts';
import { scrapeStockDetails } from './scrape-stock-details.ts';
import { scrapeWatchlist } from './scrape-watchlist.ts';

const timeStart = performance.now();

Deno.writeTextFileSync(`${TR_OUTPUT_FOLDER_PATH}/positions.ts`, '');
Deno.writeTextFileSync(`${TR_OUTPUT_FOLDER_PATH}/instruments.ts`, '');
Deno.writeTextFileSync(`${TR_OUTPUT_FOLDER_PATH}/watchlist-instruments.ts`, '');
Deno.writeTextFileSync(`${TR_OUTPUT_FOLDER_PATH}/etf-details.ts`, '');
Deno.writeTextFileSync(`${TR_OUTPUT_FOLDER_PATH}/stock-details.ts`, '');
Deno.writeTextFileSync(`${TR_OUTPUT_FOLDER_PATH}/price-snapshots.ts`, '');

console.log(green(bold('Scraping finished.')));

await scrapePortfolio();
await scrapeInstruments();
await scrapeWatchlist();
await scrapeETFDetails();
await scrapeStockDetails();
await scrapePriceSnapshots();
const timeEnd = performance.now();

console.log(
  green(bold(`Scraping finished in ${(timeEnd - timeStart) / 1000}s.`)),
);
