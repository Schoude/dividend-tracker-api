import { supabase } from '../../../../src/supabase/client.ts';
import { stockDetails } from '../../output/stock-details.ts';

const analystRatings = stockDetails.map((stock) => {
  const isin = stock.isin;

  return {
    isin,
    recommendations_buy: stock.analystRating.recommendations.buy,
    recommendations_hold: stock.analystRating.recommendations.hold,
    recommendations_outperform: stock.analystRating.recommendations.outperform,
    recommendations_underperform:
      stock.analystRating.recommendations.underperform,
    target_price_average: Number(
      stock.analystRating.targetPrice.average.toFixed(2),
    ),
    target_price_high: Number(
      stock.analystRating.targetPrice.high.toFixed(2),
    ),
    target_price_low: Number(stock.analystRating.targetPrice.low.toFixed(2)),
  };
});

const { data, error } = await supabase.from('analyst_ratings').insert(
  analystRatings,
)
  .select('isin');

console.log({ data });
console.log({ error });
