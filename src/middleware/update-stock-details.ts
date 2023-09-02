import { Status } from 'oak';
import { supabase } from '../supabase/client.ts';
import { RouterMiddleWareFunction } from './types.ts';
import {
  TR_SESSION_KEY,
  WS_CONNECTION_TYPE,
} from '../../scraping/tr/constants.ts';
import { createTrSocket } from '../../scraping/tr/websocket.ts';
import {
  extractJSONFromString,
  extractSubId,
} from '../../scraping/tr/utils.ts';
import { bgRed, bold } from 'std/fmt/colors.ts';
import { kv } from '../../scraping/tr/kv/index.ts';
import { StockDetail } from '../../scraping/tr/types/stock-detail.ts';

export const updateStockDetails: RouterMiddleWareFunction = async (
  context,
  next,
) => {
  const { error, data } = await supabase
    .from('stocks')
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

    if (jsonString.includes('NOT_FOUND')) {
      console.log(
        bgRed(
          `Stock details not found for: ${bold(data[subId].name!)}`,
        ),
      );

      if (processedInstrumentsCount === data.length) {
        trSocket.close();
      }

      return;
    }

    const stockDetail = extractJSONFromString<StockDetail>(event.data);

    const analystRatingResult = await supabase
      .from('analyst_ratings')
      .update({
        recommendations_buy: stockDetail.analystRating.recommendations.buy,
        recommendations_hold: stockDetail.analystRating.recommendations.hold,
        recommendations_outperform:
          stockDetail.analystRating.recommendations.outperform,
        recommendations_underperform:
          stockDetail.analystRating.recommendations.underperform,
        target_price_average: stockDetail.analystRating.targetPrice.average,
        target_price_high: stockDetail.analystRating.targetPrice.high,
        target_price_low: stockDetail.analystRating.targetPrice.low,
      })
      .eq('isin', stockDetail.isin);

    if (analystRatingResult.error) {
      context.response.status = Status.InternalServerError;
      context.response.body = {
        error: analystRatingResult.error,
      };

      return;
    }

    const companyInfosResult = await supabase
      .from('company_infos')
      .update({
        beta: stockDetail.company.beta,
        ceoname: stockDetail.company.ceoName,
        cfoname: stockDetail.company.cfoName,
        peratiosnapshot: stockDetail.company.peRatioSnapshot,
        pbratiosnapshot: stockDetail.company.pbRatioSnapshot,
        marketcapsnapshot: stockDetail.company.marketCapSnapshot,
        eps: stockDetail.company.eps,
        employeecount: stockDetail.company.employeeCount,
        dividendyieldsnapshot: stockDetail.company.dividendYieldSnapshot,
        description: stockDetail.company.description,
        countrycode: stockDetail.company.countryCode,
        cooname: stockDetail.company.cooName,
      })
      .eq('isin', stockDetail.isin);

    if (companyInfosResult.error) {
      context.response.status = Status.InternalServerError;
      context.response.body = {
        error: companyInfosResult.error,
      };

      return;
    }

    if (processedInstrumentsCount === data.length) {
      trSocket.close();
    }
  };

  trSocket.onclose = () => {
    console.log('upsert the stock details');
  };

  return next();
};
