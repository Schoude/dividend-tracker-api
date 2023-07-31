import { supabase } from '../../../../src/supabase/client.ts';
import { Database } from '../../../../src/supabase/types.ts';
import { etfDetails } from '../../output/etf-details.ts';

type RowInsertDividendsFund =
  Database['public']['Tables']['dividends_fund']['Insert'];

const inserts: RowInsertDividendsFund[] = [];

for (const fund of etfDetails) {
  const dbfund = await supabase
    .from('funds')
    .select('id, isin')
    .eq('isin', fund.isin)
    .single();

  for (const dividend of fund.distributions!) {
    const knownDividend = await supabase
      .from('dividends_fund')
      .select('id')
      .eq('isin', dbfund.data?.isin!)
      .eq('payment_date_iso', dividend.paymentDate)
      .eq('ex_date_iso', dividend.exDate);

    if (knownDividend.error || knownDividend.data.length > 0) {
      continue;
    }

    inserts.push({
      isin: fund.isin,
      fund_id: dbfund.data?.id!,
      amount: Number(dividend.amount.toFixed(2)),
      ex_date_unix: new Date(dividend.exDate).getTime(),
      ex_date_iso: dividend.exDate,
      record_date_unix: new Date(dividend.recordDate).getTime(),
      record_date_iso: dividend.recordDate,
      payment_date_unix: new Date(dividend.paymentDate).getTime(),
      payment_date_iso: dividend.paymentDate,
    });
  }
}

const dividendsFundResult = await supabase.from('dividends_fund')
  .insert(inserts)
  .select('isin, ex_date_iso');

console.log(dividendsFundResult.data);

if (dividendsFundResult.error) {
  console.log(dividendsFundResult.error);
}
