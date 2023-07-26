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

// Fill the stocks table
const { data: insertedStocks, error: stockInsertError } = await supabase.from(
  'stocks',
).insert(
  stocksComplete,
)
  .select();

console.log({ insertedStocks });
if (stockInsertError) {
  console.log({ stockInsertError });
}

// Add values to the stocks_sectors table
await Promise.all([
  ...instruments.filter((instrument) => instrument.typeId === 'stock'),
  ...instrumentsWatchlist,
].map(async (stock) => {
  const stockId = insertedStocks?.find((dbStock) => dbStock.isin === stock.isin)
    ?.id!;
  const sectorsOfStock = stock.tags.filter((tag) => tag.type === 'sector')
    .map((sector) => sector.id);

  const dbSectorResult = await supabase.from('sectors').select('id')
    .in('sector_id', sectorsOfStock);

  const insertValues = dbSectorResult.data?.map((sector) => ({
    sector_id: sector.id,
    stock_id: stockId,
  }))!;

  return await supabase.from('stocks_sectors').insert(insertValues);
}));

// Get the stock with the company_infos, analyst_ratings and sectors
const { data, error } = await supabase.from('stocks')
  .select(`
    company_name,
    company_infos (description),
    analyst_ratings (recommendations_buy),
    sectors (
      name
    )
  `)
  .eq('company_name', 'BASF');

console.log({ data });
console.log({ error });

// TODO: one-to-many relation stocks<-events
