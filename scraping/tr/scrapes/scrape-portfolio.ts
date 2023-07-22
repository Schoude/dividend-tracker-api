import { bgRed } from 'std/fmt/colors.ts';
import { authorize } from '../auth.ts';
import {
  TR_OUTPUT_FOLDER_PATH,
  TR_SESSION_KEY,
  WS_CONNECTION_TYPE,
} from '../constants.ts';
import { kv } from '../kv/index.ts';
import { PositionsData } from '../types/position.ts';
import { extractJSONFromString } from '../utils.ts';
import { createTrSocket } from '../websocket.ts';

async function scrapePortfolio() {
  const { trSocket, TR_SESSION } = await createTrSocket();

  trSocket.onopen = () => {
    trSocket.send(
      'connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 114.0.0","clientId":"app.traderepublic.com","clientVersion":"1.22.5"}',
    );

    trSocket.send(
      `sub 1 {"type": "${WS_CONNECTION_TYPE.COMPACT_PORTFOLIO}", "token": "${TR_SESSION}"}`,
    );
  };

  trSocket.onmessage = async (event) => {
    if (event.data === 'connected') {
      return;
    }

    trSocket.send('unsub 1');
    trSocket.close();

    const jsonString = extractJSONFromString<string>(event.data, {
      parse: false,
    });

    if (jsonString.includes('AUTHENTICATION_ERROR')) {
      console.log(bgRed('tr_session token has expired or has been revoked.'));

      await kv.delete([TR_SESSION_KEY]);

      await authorize(scrapePortfolio);
      return;
    }

    const positionsData = JSON.parse(jsonString) as PositionsData;

    const fileContent = `export const positions = ${
      JSON.stringify(positionsData.positions)
    }`;

    Deno.writeTextFileSync(
      `${TR_OUTPUT_FOLDER_PATH}/positions.ts`,
      fileContent,
    );
  };
}

scrapePortfolio();
