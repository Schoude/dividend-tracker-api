import { supabase } from '../../../../src/supabase/client.ts';
import { stockDetails } from '../../output/stock-details.ts';

const companyEvents = stockDetails.flatMap((stock) => {
  const isin = stock.isin;

  return stock.events.map((event) => {
    return {
      isin,
      event_id: event.id,
      title: event.title,
      description: event.description,
      timestamp: event.timestamp,
    };
  });
});

const { data, error } = await supabase.from('company_events').insert(
  companyEvents,
)
  .select('isin');

console.log({ data });
console.log({ error });
