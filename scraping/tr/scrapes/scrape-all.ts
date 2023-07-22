// Clear all files from content, but don't delete them.

import { bold, green } from 'std/fmt/colors.ts';
import { TR_OUTPUT_FOLDER_PATH } from '../constants.ts';
import { scrapeETFDetails } from './scrape-etf-details.ts';
import { scrapeInstruments } from './scrape-instruments.ts';
import { scrapePortfolio } from './scrape-portfolio.ts';
import { scrapePriceSnapshots } from './scrape-price-snapshots.ts';
import { scrapeStockDetails } from './scrape-stock-details.ts';
import { scrapeWatchlist } from './scrape-watchlist.ts';
import { scrapeTimeline } from './scrape-timeline.ts';

const timeStart = performance.now();

Deno.writeTextFileSync(
  `${TR_OUTPUT_FOLDER_PATH}/positions.ts`,
  `import type { Position } from '../types/position.ts';
export const positions: Position[] = [];`,
);
Deno.writeTextFileSync(
  `${TR_OUTPUT_FOLDER_PATH}/instruments.ts`,
  `import type { InstrumentSaveable } from '../types/instrument.ts';
export const instruments: InstrumentSaveable[] = [];`,
);
Deno.writeTextFileSync(
  `${TR_OUTPUT_FOLDER_PATH}/watchlist-instruments.ts`,
  `import type { InstrumentSaveable } from '../types/instrument.ts';
export const instrumentsWatchlist:InstrumentSaveable[] = [];
  `,
);
Deno.writeTextFileSync(
  `${TR_OUTPUT_FOLDER_PATH}/etf-details.ts`,
  `import type { ETFDetail } from '../types/etf-detail.ts';
export const etfDetails: ETFDetail[] = [];`,
);
Deno.writeTextFileSync(
  `${TR_OUTPUT_FOLDER_PATH}/stock-details.ts`,
  `import type { StockDetailSaveable } from '../types/stock-detail.ts';
export const stockDetails: StockDetailSaveable[] = [];`,
);
Deno.writeTextFileSync(
  `${TR_OUTPUT_FOLDER_PATH}/price-snapshots.ts`,
  `import type { PriceSnapshot } from '../types/price-snapshots.ts';
export const priceSnapshots: PriceSnapshot[] = [];`,
);
Deno.writeTextFileSync(
  `${TR_OUTPUT_FOLDER_PATH}/timeline.ts`,
  `import type { TimelineDatum } from '../types/timeline.ts';
  export const timeline: TimelineDatum[] = [];`,
);
Deno.writeTextFileSync(
  `${TR_OUTPUT_FOLDER_PATH}/timeline-details.ts`,
  `import type { TimelineOrderDetail } from '../types/timeline-detail.ts';
export const timelineDetails: TimelineOrderDetail[] = [];`,
);

await scrapePortfolio();
await scrapeInstruments();
await scrapeWatchlist();
await scrapeETFDetails();
await scrapeStockDetails();
await scrapePriceSnapshots();
await scrapeTimeline();

const timeEnd = performance.now();

console.log(
  green(
    bold(`Scraping finished in ${((timeEnd - timeStart) / 1000).toFixed(4)}s.`),
  ),
);
