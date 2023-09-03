import { Status } from 'oak';
import { supabase } from '../supabase/client.ts';
import { RouterMiddleWareFunction } from './types.ts';
import { createTrSocket } from '../../scraping/tr/websocket.ts';
import {
  TR_SESSION_KEY,
  WS_CONNECTION_TYPE,
} from '../../scraping/tr/constants.ts';
import { bgRed, bold } from 'std/fmt/colors.ts';
import { kv } from '../../scraping/tr/kv/index.ts';
import { ETFDetail } from '../../scraping/tr/types/etf-detail.ts';
import {
  extractJSONFromString,
  extractSubId,
} from '../../scraping/tr/utils.ts';

export const updateDividendsFund: RouterMiddleWareFunction = async (
  context,
  next,
) => {
  const { error, data } = await supabase
    .from('funds')
    .select('id, isin, name');

  if (error) {
    console.log(error);

    context.response.status = Status.InternalServerError;

    return;
  }

  let processedInstrumentsCount = 0;

  const { trSocket, TR_SESSION } = await createTrSocket();

  trSocket.onopen = () => {
    trSocket.send(
      'connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 114.0.0","clientId":"app.traderepublic.com","clientVersion":"1.22.5"}',
    );

    for (let index = 0; index < data.length; index++) {
      const instrument = data[index];
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

    processedInstrumentsCount++;
    trSocket.send(`unsub ${subId}`);

    const jsonString = extractJSONFromString<string>(event.data, {
      parse: false,
    });

    if (jsonString.includes('AUTHENTICATION_ERROR')) {
      console.log(bgRed('tr_session token has expired or has been revoked.'));

      await kv.delete([TR_SESSION_KEY]);

      return;
    }

    if (jsonString.includes('NOT_FOUND')) {
      console.log(
        bgRed(
          `ETF details not found for: ${bold(data[subId].name!)}`,
        ),
      );

      if (processedInstrumentsCount === data.length) {
        trSocket.close();
      }

      return;
    }

    const etfDetail = extractJSONFromString<ETFDetail>(event.data);

    const fund = data[subId];

    for (const dividend of etfDetail.distributions!) {
      const knownDividend = await supabase
        .from('dividends_fund')
        .select('id')
        .eq('isin', fund.isin)
        .eq('payment_date_iso', dividend.paymentDate)
        .eq('ex_date_iso', dividend.exDate);

      if (knownDividend.error || knownDividend.data.length > 0) {
        console.log(
          `Dividend already exists: ${fund.isin} @ ${dividend.paymentDate}`,
        );

        continue;
      }

      const insert = {
        isin: fund.isin,
        fund_id: fund.id,
        amount: Number(dividend.amount.toFixed(2)),
        ex_date_unix: new Date(dividend.exDate).getTime(),
        ex_date_iso: dividend.exDate,
        record_date_unix: new Date(dividend.recordDate).getTime(),
        record_date_iso: dividend.recordDate,
        payment_date_unix: new Date(dividend.paymentDate).getTime(),
        payment_date_iso: dividend.paymentDate,
      };

      const { error } = await supabase.from('dividends_fund')
        .insert(insert);

      if (error) {
        console.log(error);

        context.response.status = Status.InternalServerError;

        return;
      }
    }

    if (processedInstrumentsCount === data.length) {
      trSocket.close();
    }
  };

  return next();
};
