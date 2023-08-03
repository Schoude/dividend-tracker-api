import { supabase } from '../client.ts';

export async function getStocksByISINs(stockIsins: string[]) {
  try {
    const stocksResponse = await supabase
      .from('stocks')
      .select(`
        isin,
        intl_symbol,
        company_name,
        price_snapshot,
        ipo_date,
        type_id,
        exchange_id,
        image_id,
        distribution_frequency,
        company_infos (
          isin,
          name,
          description,
          yearfounded,
          peratiosnapshot,
          pbratiosnapshot,
          dividendyieldsnapshot,
          marketcapsnapshot,
          beta,
          countrycode,
          ceoname,
          cfoname,
          cooname,
          employeecount,
          eps
        ),
        analyst_ratings (
          recommendations_buy
        ),
        sectors (
          name
        ),
        company_events (
          title,
          description,
          timestamp
        ),
        dividends_stock (
          isin,
          ex_date_unix,
          ex_date_iso,
          payment_date_unix,
          payment_date_iso,
          amount,
          info
        )
      `)
      .order('timestamp', {
        foreignTable: 'company_events',
        ascending: true,
      })
      .order('ex_date_unix', {
        foreignTable: 'dividends_stock',
        ascending: false,
      })
      .in('isin', stockIsins);

    if (stocksResponse.error) {
      throw new Error(stocksResponse.error.message);
    }

    return stocksResponse.data;
  } catch (error) {
    throw error;
  }
}
