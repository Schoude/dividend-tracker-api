import { supabase } from '../../../../src/supabase/client.ts';
import { instruments } from '../../output/instruments.ts';

const inserts = [];

for await (const instrument of instruments) {
  const foundPosition = await supabase
    .from('positions')
    .select('id')
    .eq('isin', instrument.isin);

  if (foundPosition.data) {
    console.log('Instrument already in portfolio');
    continue;
  }

  if (instrument.typeId === 'fund') {
    const dbFundResult = await supabase
      .from('funds')
      .select('isin')
      .eq('isin', instrument.isin)
      .single();

    if (dbFundResult.error) {
      console.log(dbFundResult.error);
    } else {
      inserts.push({
        isin: dbFundResult.data.isin,
        instrument_type: instrument.typeId,
        portfolio_id: 1,
      });
    }

    continue;
  }

  if (instrument.typeId === 'stock') {
    const dbStockResult = await supabase
      .from('stocks')
      .select('isin')
      .eq('isin', instrument.isin)
      .single();

    if (dbStockResult.error) {
      console.log(dbStockResult.error);
    } else {
      inserts.push({
        isin: dbStockResult.data.isin,
        instrument_type: instrument.typeId,
        portfolio_id: 1,
      });
    }
  }
}

const positionsInsertResult = await supabase
  .from('positions')
  .insert(inserts)
  .select();

if (positionsInsertResult.error) {
  console.log(positionsInsertResult.error);
}

console.log(positionsInsertResult.data);
