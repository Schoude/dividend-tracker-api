import { helpers, Status } from 'oak';
import { supabase } from '../supabase/client.ts';
import { bgRed, green } from 'std/fmt/colors.ts';
import {
  TR_SESSION_KEY,
  WS_CONNECTION_TYPE,
} from '../../scraping/tr/constants.ts';
import { kv } from '../../scraping/tr/kv/index.ts';
import { TickData } from '../../scraping/tr/types/price-snapshots.ts';
import {
  extractJSONFromString,
  extractSubId,
} from '../../scraping/tr/utils.ts';
import { createTrSocket } from '../../scraping/tr/websocket.ts';
import { RouterMiddleWareFunction } from './types.ts';

export const updatePrices: RouterMiddleWareFunction = async (
  context,
  next,
) => {
  const query = helpers.getQuery(context) as { type: 'stock' | 'funds' };

  const { error, data } = await supabase
    .from(query.type)
    .select('id, isin, exchange_id');

  if (error) {
    console.log(error);

    context.response.status = Status.InternalServerError;

    return;
  }

  const priceUpdates: {
    id: number;
    price_snapshot: number;
  }[] = [];
  let processedInstrumentsCount = 0;

  const { trSocket, TR_SESSION } = await createTrSocket();

  trSocket.onopen = () => {
    trSocket.send(
      'connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 114.0.0","clientId":"app.traderepublic.com","clientVersion":"1.22.5"}',
    );

    for (let index = 0; index < data.length; index++) {
      const { exchange_id, isin } = data[index];
      const sub =
        `sub ${index} {"type": "${WS_CONNECTION_TYPE.TICKER}", "id": "${isin}.${exchange_id}", "token": "${TR_SESSION}"}`;

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

    const jsonString = extractJSONFromString<string>(event.data, {
      parse: false,
    });

    if (jsonString.includes('AUTHENTICATION_ERROR')) {
      console.log(bgRed('tr_session token has expired or has been revoked.'));

      await kv.delete([TR_SESSION_KEY]);

      context.response.status = Status.Unauthorized;
      return;
    }

    const tickData = extractJSONFromString<TickData>(event.data);

    const { id, isin } = data[subId];

    console.log('updated', { isin, price: tickData.last.price });

    priceUpdates.push({
      id,
      price_snapshot: Number(tickData.last.price),
    });

    if (processedInstrumentsCount === data.length) {
      trSocket.close();
    }
  };

  trSocket.onclose = async () => {
    const { data, error } = await supabase
      .from(query.type)
      .upsert(priceUpdates)
      .select('name');

    if (error) {
      console.log(error);

      return;
    }

    console.log(
      green(`Prices updated: ${data.length}\nType: ${query.type}`),
    );
  };

  return next();
};
