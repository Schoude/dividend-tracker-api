import { bgRed, bold } from 'std/fmt/colors.ts';
import { supabase } from '../../../../src/supabase/client.ts';
import { Database } from '../../../../src/supabase/types.ts';
import { stockDetails } from '../../output/stock-details.ts';

type RowInsertDividendsStock =
  Database['public']['Tables']['dividends_stock']['Insert'];

const inserts: RowInsertDividendsStock[] = [];
const errorStocks: { name: string; symbol: string }[] = [];

const dbStocks = await supabase
  .from('stocks')
  .select('id, isin')
  .is('distribution_frequency', null);

if (dbStocks.status > 200 || dbStocks.error) {
  console.log(bgRed(bold('Error getting the stocks from DB.')));
}

for (const stock of dbStocks.data!) {
  for (
    const dividend of stockDetails.find((stockDetail) =>
      stockDetail.isin === stock.isin
    )!.dividends
  ) {
    const knownDividend = await supabase
      .from('dividends_stock')
      .select('id')
      .eq('isin', stock.isin!)
      .eq('payment_date_iso', dividend.paymentDate)
      .eq('ex_date_iso', dividend.exDate);

    if (knownDividend.error || knownDividend.data.length > 0) {
      continue;
    }

    inserts.push({
      isin: stock.isin!,
      info: null,
      amount: Number(dividend.amount.toFixed(2)),
      ex_date_iso: dividend.exDate,
      ex_date_unix: new Date(dividend.exDate).getTime(),
      payment_date_iso: dividend.paymentDate,
      payment_date_unix: new Date(dividend.paymentDate).getTime(),
      stock_id: stock.id!,
    });
  }
}

const dividendsStockResult = await supabase
  .from('dividends_stock')
  .insert(inserts)
  .select('isin, payment_date_iso');

console.log(dividendsStockResult.data);

if (errorStocks.length > 0) {
  console.log(errorStocks);
}

if (dividendsStockResult.error) {
  console.log(dividendsStockResult.error);
}
