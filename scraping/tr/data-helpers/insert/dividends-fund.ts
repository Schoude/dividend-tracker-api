import { supabase } from '../../../../src/supabase/client.ts';
import { etfDetails } from '../../output/etf-details.ts';

const inserts = await Promise.all(
  etfDetails.map(async (fund) => {
    const dbfund = await supabase.from('funds').select('id').eq(
      'isin',
      fund.isin,
    ).single();

    return fund.distributions?.map((dividend) => {
      return {
        isin: fund.isin,
        fund_id: dbfund.data?.id!,
        amount: Number(dividend.amount.toFixed(2)),
        ex_date_unix: new Date(dividend.exDate).getTime(),
        ex_date_iso: dividend.exDate,
        record_date_unix: new Date(dividend.recordDate).getTime(),
        record_date_iso: dividend.recordDate,
        payment_date_unix: new Date(dividend.paymentDate).getTime(),
        payment_date_iso: dividend.paymentDate,
      };
    })!;
  }),
);

const dividendsFundResult = await supabase.from('dividends_fund')
  .insert(inserts.flat())
  .select('isin, ex_date_iso');

console.log(dividendsFundResult.data);

if (dividendsFundResult.error) {
  console.log(dividendsFundResult.error);
}
