import { supabase } from '../../../../src/supabase/client.ts';
import { instruments } from '../../output/instruments.ts';
import { instrumentsWatchlist } from '../../output/watchlist-instruments.ts';

const stocksInstruments = instruments.filter((instrument) =>
  instrument.typeId === 'stock'
).map(async (stock) => {
  const { data } = await supabase.from('company_infos')
    .select('*')
    .eq('isin', stock.isin)
    .single();

  return {
    company_info_id: data?.id,
    exchange_id: stock.exchangeIds[0],
    image_id: stock.imageId,
    intl_symbol: stock.intlSymbol === '' ? null : stock.intlSymbol,
    company_name: stock.company.name,
    ipo_date: stock.company.ipoDate,
    isin: stock.isin,
    type_id: stock.typeId,
  };
});

const stocksInstrumentsWatchlist = instrumentsWatchlist.filter((instrument) =>
  instrument.typeId === 'stock'
).map(async (stock) => {
  const { data } = await supabase.from('company_infos')
    .select('*')
    .eq('isin', stock.isin)
    .single();

  return {
    company_info_id: data?.id,
    exchange_id: stock.exchangeIds[0],
    image_id: stock.imageId,
    intl_symbol: stock.intlSymbol === '' ? null : stock.intlSymbol,
    company_name: stock.company.name,
    ipo_date: stock.company.ipoDate,
    isin: stock.isin,
    type_id: stock.typeId,
  };
});

const stocksComplete = await Promise.all([
  ...stocksInstruments,
  ...stocksInstrumentsWatchlist,
]);

const { data, error } = await supabase.from('stocks').insert(stocksComplete)
  .select();

console.log({ data });
console.log({ error });

// Get the stock with the company_infos
// const { data, error } = await supabase.from('stocks')
//   .select(`
//     company_name,
//     company_infos (description)
//   `)
//   .eq('company_name', 'BASF');

// console.log({ data });
// console.log({ error });
