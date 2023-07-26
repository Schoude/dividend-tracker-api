import { supabase } from '../../../../src/supabase/client.ts';
import { stockDetails } from '../../output/stock-details.ts';

const companyEvents = await Promise.all(
  stockDetails.flatMap(async (stock) => {
    const isin = stock.isin;
    const dbStockResult = await supabase.from('stocks').select('id')
      .eq(
        'isin',
        isin,
      )
      .single();

    return stock.events.map((event) => {
      return {
        isin,
        event_id: event.id,
        title: event.title,
        description: event.description,
        timestamp: event.timestamp,
        stock_id: dbStockResult.data?.id,
      };
    });
  }),
);

const { data, error } = await supabase.from('company_events')
  .insert(companyEvents.flat())
  .select('isin');

console.log({ data });
console.log({ error });
