import { bgRed } from 'std/fmt/colors.ts';
import {
  TR_OUTPUT_FOLDER_PATH,
  TR_SESSION_KEY,
  WS_CONNECTION_TYPE,
} from '../constants.ts';
import type { Instrument, InstrumentSaveable } from '../types/instrument.ts';
import { extractJSONFromString, extractSubId } from '../utils.ts';
import { createTrSocket } from '../websocket.ts';
import { kv } from '../kv/index.ts';
import { authorize } from '../auth.ts';
import type { Watchlist } from '../types/watchlist.ts';

async function scrapeWatchlist() {
  let watchList: Watchlist;
  const instrumentsSaveable: InstrumentSaveable[] = [];
  let processedInstrumentsCount = 0;

  const { trSocket, TR_SESSION } = await createTrSocket();

  trSocket.onopen = () => {
    trSocket.send(
      'connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 114.0.0","clientId":"app.traderepublic.com","clientVersion":"1.22.5"}',
    );

    trSocket.send(
      `sub 100 {"type": "${WS_CONNECTION_TYPE.WATCHLIST}", "watchlistId": "favorites", "token": "${TR_SESSION}"}`,
    );
  };

  // Fetch the watchlist with the instruments array and send an event for each instrument.
  trSocket.addEventListener('message', async (event) => {
    if (event.data === 'connected') {
      return;
    }

    const jsonString = extractJSONFromString<string>(event.data, {
      parse: false,
    });

    if (jsonString.includes('AUTHENTICATION_ERROR')) {
      console.log(bgRed('tr_session token has expired or has been revoked.'));

      await kv.delete([TR_SESSION_KEY]);

      await authorize(scrapeWatchlist);
      return;
    }

    const subId = extractSubId(event.data);

    if (subId) {
      trSocket.send(`unsub ${subId}`);
    }

    if (subId === 100) {
      watchList = extractJSONFromString<Watchlist>(event.data);

      for (let index = 0; index < watchList.instruments.length; index++) {
        const instrument = watchList.instruments[index];
        const sub =
          `sub ${index} {"type": "${WS_CONNECTION_TYPE.INSTRUMENT}", "id": "${instrument.instrument_id}", "jurisdiction": "DE", "token": "${TR_SESSION}"}`;

        trSocket.send(sub);
      }
    }
  });

  // Listen to the instrument events send in the first listener.
  trSocket.addEventListener('message', (event) => {
    if (event.data === 'connected') {
      return;
    }

    const jsonString = extractJSONFromString<string>(event.data, {
      parse: false,
    });

    if (jsonString.includes('AUTHENTICATION_ERROR')) {
      return;
    }

    const subId = extractSubId(event.data);

    if (subId === 100) {
      return;
    }

    if (subId) {
      trSocket.send(`unsub ${subId}`);
    }

    const instrument = extractJSONFromString<Instrument>(event.data);
    processedInstrumentsCount++;

    if (instrument.typeId === 'crypto' || instrument.typeId === 'derivative') {
      return;
    }

    const instrumentSaveable: InstrumentSaveable = {
      intlSymbol: instrument.intlSymbol,
      isin: instrument.isin,
      company: instrument.company,
      tags: instrument.tags.filter((tag) =>
        tag.type === 'sector' || tag.type === 'country'
      ),
      typeId: instrument.typeId,
      exchangeIds: instrument.exchangeIds,
      imageId: instrument.imageId,
    };

    instrumentsSaveable.push(instrumentSaveable);

    if (processedInstrumentsCount === watchList.size) {
      trSocket.close();
    }
  });

  trSocket.onclose = () => {
    const fileContent = `export const instrumentsWatchlist = ${
      JSON.stringify(instrumentsSaveable)
    }`;

    Deno.writeTextFileSync(
      `${TR_OUTPUT_FOLDER_PATH}/watchlist-instruments.ts`,
      fileContent,
    );
  };
}

scrapeWatchlist();
