import { supabase } from '../../../../src/supabase/client.ts';
import { etfDetails } from '../../output/etf-details.ts';
import { instruments } from '../../output/instruments.ts';
import { priceSnapshots } from '../../output/price-snapshots.ts';

const funds = instruments.filter((instrument) => instrument.typeId === 'fund');

const fundInserts = funds.map((fund) => {
  const fundPrice = priceSnapshots.find((priceSnapshot) =>
    priceSnapshot.isin === fund.isin
  );
  const etfDetail = etfDetails.find((etfDetail) =>
    etfDetail.isin === fund.isin
  );

  return {
    focus: etfDetail?.focus ? `${etfDetail?.focus?.join('. ')}.` : null,
    distribution_frequency: etfDetail?.distributionFrequency ?? null,
    price_snapshot: Number(fundPrice?.price.toFixed(2)),
    description: fund.company.description,
    exchange_id: fund.exchangeIds[0],
    name: fund.company.name,
    image_id: fund.imageId,
    isin: fund.isin,
    type_id: fund.typeId,
  };
});

const fundsInsertResult = await supabase.from('funds').insert(fundInserts)
  .select();

console.log(fundsInsertResult.data);

if (fundsInsertResult.error) {
  console.log(fundsInsertResult.error);
}
