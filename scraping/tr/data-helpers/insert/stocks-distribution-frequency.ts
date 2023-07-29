import { supabase } from '../../../../src/supabase/client.ts';
import stocks from '../../../../stocks.json' assert { type: 'json' };

await Promise.all(stocks.map(async (stock) => {
  const upatedStock = await supabase
    .from('stocks')
    .update({ distribution_frequency: stock.frequency })
    .eq('intl_symbol', stock.symbol)
    .select('isin');

  console.log(upatedStock.data);

  if (upatedStock.error) {
    console.log(upatedStock.error);
  }
}));
