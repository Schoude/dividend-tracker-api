import { supabase } from '../client.ts';

export async function getFundsByISINs(fundIsins: string[]) {
  try {
    const fundsResponse = await supabase
      .from('funds')
      .select(`
        isin,
        fund_name,
        price_snapshot,
        sectors (
          name,
          icon
        ),
        dividends_fund (
          isin,
          ex_date_unix,
          ex_date_iso,
          record_date_iso,
          record_date_unix,
          payment_date_unix,
          payment_date_iso,
          amount
        )
      `)
      .order('ex_date_unix', {
        foreignTable: 'dividends_fund',
        ascending: false,
      })
      .in('isin', fundIsins);

    if (fundsResponse.error) {
      throw new Error(fundsResponse.error.message);
    }

    return fundsResponse.data;
  } catch (error) {
    throw error;
  }
}
