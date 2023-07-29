import { bgRed, bold } from 'std/fmt/colors.ts';
import { supabase } from '../../../../src/supabase/client.ts';
import { Database } from '../../../../src/supabase/types.ts';
import stocks from '../../../../stocks.json' assert { type: 'json' };

type RowInsertDividendsStock =
  Database['public']['Tables']['dividends_stock']['Insert'];

const inserts: RowInsertDividendsStock[][] = await Promise.all(
  stocks.map(async (stock) => {
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

      return;
    }

    return stock.dividends.map((dividend) => {
      return {
        isin: dbStock.data?.isin!,
        info: dividend.info === '' ? null : dividend.info,
        amount: Number(dividend.cash_amount.toFixed(2)),
        ex_date_iso: dividend.ex_dividend_date,
        ex_date_unix: new Date(dividend.ex_dividend_date).getTime(),
        payment_date_iso: dividend.payout_date,
        payment_date_unix: new Date(dividend.payout_date).getTime(),
        stock_id: dbStock.data?.id!,
      } as RowInsertDividendsStock;
    });
  }).filter((value) => value != null) as RowInsertDividendsStock[],
) as RowInsertDividendsStock[][];

const dividendsStockResult = await supabase
  .from('dividends_stock')
  .insert(inserts.flat())
  .select('isin, payment_date_iso');

console.log(dividendsStockResult.data);

if (dividendsStockResult.error) {
  console.log(dividendsStockResult.error);
}
