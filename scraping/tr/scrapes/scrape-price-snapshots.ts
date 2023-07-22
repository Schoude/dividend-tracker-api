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
import { PriceSnapshot, TickData } from '../types/price-snapshots.ts';
import { parse } from 'std/flags/mod.ts';

const flags = parse(Deno.args, {
  boolean: ['cli'],
});

const instrumentsComplete: InstrumentSaveable[] = instruments.concat(
  instrumentsWatchlist as InstrumentSaveable[],
).filter((instrument) =>
  instrument.typeId === 'fund' || instrument.typeId === 'stock'
) as InstrumentSaveable[];
const instrumentPriceSnapshots: PriceSnapshot[] = [];
let processedInstrumentsCount = 0;

export async function scrapePriceSnapshots() {
  const { trSocket, TR_SESSION } = await createTrSocket();

  trSocket.onopen = () => {
    trSocket.send(
      'connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 114.0.0","clientId":"app.traderepublic.com","clientVersion":"1.22.5"}',
    );

    for (let index = 0; index < instrumentsComplete.length; index++) {
      const instrument = instrumentsComplete[index];
      const sub =
        `sub ${index} {"type": "${WS_CONNECTION_TYPE.TICKER}", "id": "${instrument.isin}.${
          instrument.exchangeIds[0]
        }", "token": "${TR_SESSION}"}`;

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

    processedInstrumentsCount++;
    trSocket.send(`unsub ${subId}`);
    const currentInstrument = instrumentsComplete[subId];

    const jsonString = extractJSONFromString<string>(event.data, {
      parse: false,
    });

    if (jsonString.includes('AUTHENTICATION_ERROR')) {
      console.log(bgRed('tr_session token has expired or has been revoked.'));

      await kv.delete([TR_SESSION_KEY]);

      await authorize(scrapePriceSnapshots);
      return;
    }

    if (jsonString.includes('NOT_FOUND')) {
      console.log(
        bgRed(
          `ETF details not found for: ${bold(currentInstrument.company.name)}`,
        ),
      );

      if (processedInstrumentsCount === instrumentsComplete.length) {
        trSocket.close();
      }

      return;
    }

    const tickData = extractJSONFromString<TickData>(event.data);

    instrumentPriceSnapshots.push({
      companyName: currentInstrument.company.name,
      isin: currentInstrument.isin,
      price: Number(tickData.last.price),
    });

    if (processedInstrumentsCount === instrumentsComplete.length) {
      trSocket.close();
    }
  };

  trSocket.onclose = () => {
    const fileContent = `
    import { PriceSnapshot } from '../types/price-snapshots.ts';
    export const priceSnapshots: PriceSnapshot[] = ${
      JSON.stringify(instrumentPriceSnapshots)
    }`;

    Deno.writeTextFileSync(
      `${TR_OUTPUT_FOLDER_PATH}/price-snapshots.ts`,
      fileContent,
    );

    console.log(
      green(
        bold(`Price snapshots scraped: ${instrumentPriceSnapshots.length}`),
      ),
    );
  };
}

if (flags.cli) {
  scrapePriceSnapshots();
}
