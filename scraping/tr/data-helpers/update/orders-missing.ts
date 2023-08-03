import { supabase } from '../../../../src/supabase/client.ts';
import { Database } from '../../../../src/supabase/types.ts';

type Order = Database['public']['Tables']['orders']['Insert'];

const missingOrderInserts: Order[] = [
  {
    isin: 'US30303M1027',
    instrument_type: 'stock',
    name: 'Meta Platforms',
    amount_changed: 1,
    order_id: crypto.randomUUID(),
    portfolio_id: 1,
    price: 321.95,
    timestamp: 1630540800000,
    type: 'buy',
  },
  {
    isin: 'DE0007100000',
    instrument_type: 'stock',
    name: 'Mercedes-Benz Group',
    amount_changed: 2,
    order_id: crypto.randomUUID(),
    portfolio_id: 1,
    price: 57.16,
    timestamp: 1658966400000,
    type: 'buy',
  },
  {
    isin: 'DE000DTR0CK8',
    instrument_type: 'stock',
    name: 'Daimler Truck',
    amount_changed: 1,
    order_id: crypto.randomUUID(),
    portfolio_id: 1,
    price: 47.48,
    timestamp: 1658966400000,
    type: 'buy',
  },
  {
    isin: 'US88160R1014',
    instrument_type: 'stock',
    name: 'Tesla',
    amount_changed: 0.021,
    order_id: crypto.randomUUID(),
    portfolio_id: 1,
    price: 333.65,
    timestamp: 1641168000000,
    type: 'buy',
  },
  // Funds
  {
    isin: 'LU2572257124',
    instrument_type: 'fund',
    name: 'MSCI World III USD (Dist)',
    amount_changed: 101.3835,
    order_id: crypto.randomUUID(),
    portfolio_id: 1,
    price: 76.09,
    timestamp: 1679011200000,
    type: 'buy',
  },
];

const orderInsertResult = await supabase
  .from('orders')
  .insert(missingOrderInserts)
  .select('isin, name, amount_changed, price');

if (orderInsertResult.error) {
  console.log(orderInsertResult.error);
}

console.log(orderInsertResult.data);
