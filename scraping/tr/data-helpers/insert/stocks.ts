import { supabase } from '../../../../src/supabase/client.ts';
import { instruments } from '../../output/instruments.ts';
import { priceSnapshots } from '../../output/price-snapshots.ts';
import { instrumentsWatchlist } from '../../output/watchlist-instruments.ts';

const stocksInstruments = instruments.filter((instrument) =>
  instrument.typeId === 'stock'
).map(async (stock) => {
  const { data: companyInfo } = await supabase.from('company_infos')
    .select('*')
    .eq('isin', stock.isin)
    .single();

  const { data: analystRating } = await supabase.from('analyst_ratings')
    .select('*')
    .eq('isin', stock.isin)
    .single();

  const price = priceSnapshots.find((snapshot) => snapshot.isin === stock.isin);

  return {
    company_info_id: companyInfo?.id,
    analyst_rating_id: analystRating?.id,
    exchange_id: stock.exchangeIds[0],
    image_id: stock.imageId,
    intl_symbol: stock.intlSymbol === '' ? null : stock.intlSymbol,
    company_name: stock.company.name,
    ipo_date: stock.company.ipoDate,
    isin: stock.isin,
    type_id: stock.typeId,
    price_snapshot: Number(price?.price.toFixed(2)),
  };
});

const stocksInstrumentsWatchlist = instrumentsWatchlist.filter((instrument) =>
  instrument.typeId === 'stock'
).map(async (stock) => {
  const { data: companyInfo } = await supabase.from('company_infos')
    .select('*')
    .eq('isin', stock.isin)
    .single();

  const { data: analystRating } = await supabase.from('analyst_ratings')
    .select('*')
    .eq('isin', stock.isin)
    .single();

  const price = priceSnapshots.find((snapshot) => snapshot.isin === stock.isin);

  return {
    company_info_id: companyInfo?.id,
    analyst_rating_id: analystRating?.id,
    exchange_id: stock.exchangeIds[0],
    image_id: stock.imageId,
    intl_symbol: stock.intlSymbol === '' ? null : stock.intlSymbol,
    company_name: stock.company.name,
    ipo_date: stock.company.ipoDate,
    isin: stock.isin,
    type_id: stock.typeId,
    price_snapshot: Number(price?.price.toFixed(2)),
  };
});

const stocksComplete = await Promise.all([
  ...stocksInstruments,
  ...stocksInstrumentsWatchlist,
]);

const { data, error } = await supabase.from('stocks').insert(
  stocksComplete,
)
  .select();

console.log({ data });
console.log({ error });

// TODO: one-to-many relation stocks<-events
// TODO: many-to-many relation stocks<->sectors

// Get the stock with the company_infos and analyst_ratings
// const { data, error } = await supabase.from('stocks')
//   .select(`
//     company_name,
//     company_infos (description),
//     analyst_ratings (recommendations_buy)
//   `)
//   .eq('company_name', 'BASF');

// console.log({ data });
// console.log({ error });
