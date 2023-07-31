import { supabase } from '../../../../src/supabase/client.ts';
import { instruments } from '../../output/instruments.ts';
import { timelineDetails } from '../../output/timeline-details.ts';
import { timeline } from '../../output/timeline.ts';
import { instrumentsWatchlist } from '../../output/watchlist-instruments.ts';

const insertOrders = timelineDetails.map((detail) => {
  const event = timeline.find((event) => event.data.id === detail.id);
  const instrument = [...instruments, ...instrumentsWatchlist]
    .find((instrument) => instrument.company.name === detail.name);

  return {
    order_id: detail.id,
    type: detail.type,
    amount_changed: detail.amountChanged,
    name: detail.name,
    price: Number(detail.price.toFixed(2)),
    timestamp: event?.data.timestamp,
    isin: instrument?.isin,
    instrument_type: instrument?.typeId,
  };
});

const ordersResponse = await supabase
  .from('orders')
  .insert(insertOrders)
  .select();

if (ordersResponse.error) {
  console.log(ordersResponse.error);
}

console.log(ordersResponse.data);
