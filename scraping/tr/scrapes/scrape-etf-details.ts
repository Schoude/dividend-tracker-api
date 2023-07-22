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
import { ETFDetail } from '../types/etf-detail.ts';
import { parse } from 'std/flags/mod.ts';

const flags = parse(Deno.args, {
  boolean: ['cli'],
});

const instrumentsCompleteFunds: InstrumentSaveable[] = instruments.concat(
  instrumentsWatchlist as InstrumentSaveable[],
).filter((instrument) => instrument.typeId === 'fund') as InstrumentSaveable[];
const etfDetails: ETFDetail[] = [];
let processedETFCount = 0;

export async function scrapeETFDetails() {
  const { trSocket, TR_SESSION } = await createTrSocket();

  trSocket.onopen = () => {
    trSocket.send(
      'connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 114.0.0","clientId":"app.traderepublic.com","clientVersion":"1.22.5"}',
    );

    for (let index = 0; index < instrumentsCompleteFunds.length; index++) {
      const instrument = instrumentsCompleteFunds[index];
      const sub =
        `sub ${index} {"type": "${WS_CONNECTION_TYPE.ETF_DETAILS}", "id": "${instrument.isin}", "token": "${TR_SESSION}"}`;

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

    processedETFCount++;
    trSocket.send(`unsub ${subId}`);

    const jsonString = extractJSONFromString<string>(event.data, {
      parse: false,
    });

    if (jsonString.includes('AUTHENTICATION_ERROR')) {
      console.log(bgRed('tr_session token has expired or has been revoked.'));

      await kv.delete([TR_SESSION_KEY]);

      await authorize(scrapeETFDetails);
      return;
    }

    if (jsonString.includes('NOT_FOUND')) {
      console.log(
        bgRed(
          `ETF details not found for: ${
            bold(instrumentsCompleteFunds[subId].company.name)
          }`,
        ),
      );

      if (processedETFCount === instrumentsCompleteFunds.length) {
        trSocket.close();
      }

      return;
    }

    const etfDetail = extractJSONFromString<ETFDetail>(event.data);

    etfDetails.push(etfDetail);

    if (processedETFCount === instrumentsCompleteFunds.length) {
      trSocket.close();
    }
  };

  trSocket.onclose = () => {
    const fileContent = `export const etfDetails = ${
      JSON.stringify(etfDetails)
    }`;

    Deno.writeTextFileSync(
      `${TR_OUTPUT_FOLDER_PATH}/etf-details.ts`,
      fileContent,
    );

    console.log(green(bold(`ETF details scraped: ${etfDetails.length}`)));
  };
}
if (flags.cli) {
  scrapeETFDetails();
}
