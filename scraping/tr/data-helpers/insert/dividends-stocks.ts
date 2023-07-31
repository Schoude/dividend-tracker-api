import { bgRed, bold } from 'std/fmt/colors.ts';
import { supabase } from '../../../../src/supabase/client.ts';
import { Database } from '../../../../src/supabase/types.ts';
import stocks from '../../../../stocks.json' assert { type: 'json' };

type RowInsertDividendsStock =
  Database['public']['Tables']['dividends_stock']['Insert'];

const inserts: RowInsertDividendsStock[] = [];

for (const stock of stocks) {
  const dbStock = await supabase
    .from('stocks')
    .select('id, isin')
    .eq('intl_symbol', stock.symbol)
    .single();

  if (dbStock.status > 200) {
    console.log(
      bgRed(bold('Error finding the stock')),
      stock.stock_full_name,
      bold(stock.symbol),
    );

    continue;
  }

  for (const dividend of stock.dividends) {
    const knownDividend = await supabase
      .from('dividends_stock')
      .select('id')
      .eq('isin', dbStock.data?.isin!)
      .eq('payment_date_iso', dividend.payout_date)
      .eq('ex_date_iso', dividend.ex_dividend_date);

    if (knownDividend.error || knownDividend.data.length > 0) {
      continue;
    }

    inserts.push({
      isin: dbStock.data?.isin!,
      info: dividend.info === '' ? null : dividend.info,
      amount: Number(dividend.cash_amount.toFixed(2)),
      ex_date_iso: dividend.ex_dividend_date,
      ex_date_unix: new Date(dividend.ex_dividend_date).getTime(),
      payment_date_iso: dividend.payout_date,
      payment_date_unix: new Date(dividend.payout_date).getTime(),
      stock_id: dbStock.data?.id!,
    });
  }
}

const dividendsStockResult = await supabase
  .from('dividends_stock')
  .insert(inserts)
  .select('isin, payment_date_iso');

console.log(dividendsStockResult.data);

if (dividendsStockResult.error) {
  console.log(dividendsStockResult.error);
}
