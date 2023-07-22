import { bgRed, bold, green } from 'std/fmt/colors.ts';
import { authorize } from '../auth.ts';
import {
  TR_OUTPUT_FOLDER_PATH,
  TR_SESSION_KEY,
  WS_CONNECTION_TYPE,
} from '../constants.ts';
import { kv } from '../kv/index.ts';
import { extractJSONFromString } from '../utils.ts';
import { createTrSocket } from '../websocket.ts';
import { parse } from 'std/flags/mod.ts';
import { Datum, Timeline } from '../types/timeline.ts';
import { instruments } from '../output/instruments.ts';
import { instrumentsWatchlist } from '../output/watchlist-instruments.ts';
import { InstrumentSaveable } from '../types/instrument.ts';

const flags = parse(Deno.args, {
  boolean: ['cli'],
});

const availableInstruments: string[] =
  ([...instruments, ...instrumentsWatchlist] as (InstrumentSaveable)[])
    .map((instrument) => instrument.company.name);

const timelineResults: Datum[] = [];

export async function scrapeTimeline() {
  const { trSocket, TR_SESSION } = await createTrSocket();

  trSocket.onopen = () => {
    trSocket.send(
      'connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 114.0.0","clientId":"app.traderepublic.com","clientVersion":"1.22.5"}',
    );

    const sub =
      `sub 1 {"type": "${WS_CONNECTION_TYPE.TIMELINE}", "token": "${TR_SESSION}"}`;

    trSocket.send(
      sub,
    );
  };

  trSocket.onmessage = async (event) => {
    if (event.data === 'connected') {
      return;
    }
    if (event.data === '1 C') {
      return;
    }

    const jsonString = extractJSONFromString<string>(event.data, {
      parse: false,
    });

    if (jsonString.includes('AUTHENTICATION_ERROR')) {
      console.log(bgRed('tr_session token has expired or has been revoked.'));

      await kv.delete([TR_SESSION_KEY]);

      await authorize(scrapeTimeline);
      return;
    }

    trSocket.send('unsub 1');

    const timeline = JSON.parse(jsonString) as Timeline;

    const inlcludedData = timeline.data.filter((item) => {
      return (item.data.body?.includes('Kauf zu') ||
        item.data.body?.includes('Verkauf zu') ||
        item.data.body?.includes('Sparplan ausgeführt')) &&
        availableInstruments.includes(item.data.title);
    });

    // re-sub to the timeline always with the first entry of the result as "after"
    // until there is no more "after" in "cursors" in the response
    if (timeline.cursors.after) {
      timelineResults.push(...inlcludedData);

      const sub =
        `sub 1 {"type": "${WS_CONNECTION_TYPE.TIMELINE}", "after": "${timeline.cursors.after}" ,"token": "${TR_SESSION}"}`;

      console.log(`res-sub: ${sub}`);

      trSocket.send(
        sub,
      );
    } else {
      trSocket.close();
    }
  };

  trSocket.onclose = () => {
    const fileContent = `export const timeline = ${
      JSON.stringify(timelineResults)
    }`;

    Deno.writeTextFileSync(
      `${TR_OUTPUT_FOLDER_PATH}/timeline.ts`,
      fileContent,
    );

    console.log(
      green(bold(`Timeline scraped. ${timelineResults.length} Items`)),
    );
  };
}

if (flags.cli) {
  scrapeTimeline();
}
