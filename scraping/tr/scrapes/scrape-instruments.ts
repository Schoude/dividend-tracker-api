import { bgRed } from 'std/fmt/colors.ts';
import {
  TR_OUTPUT_FOLDER_PATH,
  TR_SESSION_KEY,
  WS_CONNECTION_TYPE,
} from '../constants.ts';
import { positions } from '../output/positions.ts';
import { Instrument, InstrumentSaveable } from '../types/instrument.ts';
import { extractJSONFromString, extractSubId } from '../utils.ts';
import { createTrSocket } from '../websocket.ts';
import { kv } from '../kv/index.ts';
import { authorize } from '../auth.ts';

async function scrapeInstruments() {
  const instruments: InstrumentSaveable[] = [];

  const { trSocket, TR_SESSION } = await createTrSocket();

  trSocket.onopen = () => {
    trSocket.send(
      'connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 114.0.0","clientId":"app.traderepublic.com","clientVersion":"1.22.5"}',
    );

    for (let index = 0; index < positions.length; index++) {
      const position = positions[index];
      const sub =
        `sub ${index} {"type": "${WS_CONNECTION_TYPE.INSTRUMENT}", "id": "${position.instrumentId}", "jurisdiction": "DE", "token": "${TR_SESSION}"}`;

      trSocket.send(sub);
    }
  };

  trSocket.onmessage = async (event) => {
    if (event.data === 'connected') {
      return;
    }

    const jsonString = extractJSONFromString<string>(event.data, {
      parse: false,
    });

    if (jsonString.includes('AUTHENTICATION_ERROR')) {
      console.log(bgRed('tr_session token has expired or has been revoked.'));

      await kv.delete([TR_SESSION_KEY]);

      await authorize(scrapeInstruments);
      return;
    }

    const subId = extractSubId(event.data);

    if (subId) {
      trSocket.send(`unsub ${subId}`);
    }

    const instrument = extractJSONFromString<Instrument>(event.data);

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

    instruments.push(instrumentSaveable);

    if (subId === positions.length - 1) {
      trSocket.close();
    }
  };

  trSocket.onclose = () => {
    const fileContent = `export const instruments = ${
      JSON.stringify(instruments)
    }`;

    Deno.writeTextFileSync(
      `${TR_OUTPUT_FOLDER_PATH}/instruments.ts`,
      fileContent,
    );
  };
}

scrapeInstruments();
