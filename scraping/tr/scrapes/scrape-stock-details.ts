import { bgRed, bold, green } from 'std/fmt/colors.ts';
import { authorize } from '../auth.ts';
import {
  TR_OUTPUT_FOLDER_PATH,
  TR_SESSION_KEY,
  WS_CONNECTION_TYPE,
} from '../constants.ts';
import { kv } from '../kv/index.ts';
import { extractJSONFromString, extractSubId } from '../utils.ts';
import { createTrSocket } from '../websocket.ts';
import { instruments } from '../output/instruments.ts';
import { instrumentsWatchlist } from '../output/watchlist-instruments.ts';
import type { InstrumentSaveable } from '../types/instrument.ts';
import type {
  StockDetail,
  StockDetailSaveable,
} from '../types/stock-detail.ts';

const instrumentsCompleteStocks: InstrumentSaveable[] = instruments.concat(
  instrumentsWatchlist as InstrumentSaveable[],
).filter((instrument) => instrument.typeId === 'stock') as InstrumentSaveable[];
const stockDetailsSaveable: StockDetailSaveable[] = [];
let processedStocksCount = 0;

async function scrapeStockInstruments() {
  const { trSocket, TR_SESSION } = await createTrSocket();

  trSocket.onopen = () => {
    trSocket.send(
      'connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 114.0.0","clientId":"app.traderepublic.com","clientVersion":"1.22.5"}',
    );

    for (let index = 0; index < instrumentsCompleteStocks.length; index++) {
      const instrument = instrumentsCompleteStocks[index];
      const sub =
        `sub ${index} {"type": "${WS_CONNECTION_TYPE.STOCK_DETAILS}", "id": "${instrument.isin}", "token": "${TR_SESSION}"}`;

      trSocket.send(sub);
    }
  };

  trSocket.onmessage = async (event) => {
    if (event.data === 'connected') {
      return;
    }

    const subId = extractSubId(event.data);

    if (subId == null) {
      console.log(bgRed('Bad response, sub ID not found.'));
      return;
    }

    processedStocksCount++;
    trSocket.send(`unsub ${subId}`);

    const jsonString = extractJSONFromString<string>(event.data, {
      parse: false,
    });

    if (jsonString.includes('AUTHENTICATION_ERROR')) {
      console.log(bgRed('tr_session token has expired or has been revoked.'));

      await kv.delete([TR_SESSION_KEY]);

      await authorize(scrapeStockInstruments);
      return;
    }

    if (jsonString.includes('NOT_FOUND')) {
      console.log(
        bgRed(
          `Stock details not found for: ${
            bold(instrumentsCompleteStocks[subId].company.name)
          }`,
        ),
      );

      if (processedStocksCount === instrumentsCompleteStocks.length) {
        trSocket.close();
      }

      return;
    }

    const stockDetail = extractJSONFromString<StockDetail>(event.data);

    stockDetailsSaveable.push({
      isin: stockDetail.isin,
      company: stockDetail.company,
      events: stockDetail.events,
      analystRating: stockDetail.analystRating,
    });

    if (processedStocksCount === instrumentsCompleteStocks.length) {
      trSocket.close();
    }
  };

  trSocket.onclose = () => {
    const fileContent = `export const stockDetails = ${
      JSON.stringify(stockDetailsSaveable)
    }`;

    Deno.writeTextFileSync(
      `${TR_OUTPUT_FOLDER_PATH}/stock-details.ts`,
      fileContent,
    );

    console.log(
      green(bold(`Stock details scraped: ${stockDetailsSaveable.length}`)),
    );
  };
}

scrapeStockInstruments();
