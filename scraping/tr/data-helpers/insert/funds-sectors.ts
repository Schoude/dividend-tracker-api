import { supabase } from '../../../../src/supabase/client.ts';
import { instruments } from '../../output/instruments.ts';

const funds = instruments.filter((instrument) => instrument.typeId === 'fund');
const dbFunds = await supabase.from('funds').select('id, isin');

const results = await Promise.all(funds.map(async (fund) => {
  const fundId = dbFunds.data
    ?.find((dbFund) => dbFund.isin === fund.isin)
    ?.id!;
  const sectorsOfFund = fund.tags.filter((tag) => tag.type === 'sector')
    .map((sector) => sector.id);

  const dbSectorResult = await supabase.from('sectors').select('id')
    .in('sector_id', sectorsOfFund);

  const insertValues = dbSectorResult.data?.map((sector) => ({
    fund_id: fundId,
    sector_id: sector.id,
  }))!;

  return await supabase.from('funds_sectors').insert(insertValues).select('*')
    .limit(1);
}));

console.log(results);
