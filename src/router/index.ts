import { Status } from 'https://deno.land/std@0.193.0/http/http_status.ts';
import { Router } from 'oak';
import { supabase } from '../supabase/client.ts';
import { getStocksByISINs } from '../supabase/utils/stocks.ts';
import { getFundsByISINs } from '../supabase/utils/funds.ts';

const router = new Router();
router
  .prefix('/api')
  .use(async (_context, next) => {
    // TODO: check the session cookie for the logged in user
    // if (userUnauthorized) {
    // context.response.status = Status.Unauthorized;
    // context.response.body = {
    //   error: 'User not found',
    // };

    // return;
    // }

    await next();
  })
  .get('/portfolios/:userId', async (context) => {
    // TODO: get userID from stored session
    const userId = context.params.userId;

    if (userId == null) {
      context.response.status = Status.Unauthorized;
      context.response.body = {
        error: 'User ID missing',
      };

      return;
    }

    try {
      const userResponse = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userResponse.error) {
        context.response.status = Status.Unauthorized;
        context.response.body = {
          error: 'User not found',
        };

        return;
      }

      // Get the portfolios of the user
      const userPortfoliosResponse = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId);

      if (userPortfoliosResponse.error) {
        context.response.status = Status.InternalServerError;
        context.response.body = {
          error: 'Error getting the portfolios of the user.',
        };

        return;
      }

      context.response.status = Status.OK;
      context.response.body = {
        data: userPortfoliosResponse.data,
      };
    } catch (error) {
      context.response.status = Status.InternalServerError;
      context.response.body = {
        error: (error as Error).message,
      };
    }
  })
  .get('/portfolio/:id/detail', async (context) => {
    const portfolioId = context.params.id;

    try {
      const portfolioResponse = await supabase
        .from('portfolios')
        .select(
          `id,
          name,
          created_at,
          updated_at,
          orders (
            order_id,
            type,
            amount_changed,
            name,
            price,
            timestamp,
            isin,
            instrument_type
          ),
          positions (
            isin,
            instrument_type
          )
        `,
        )
        .eq('id', portfolioId)
        .order('timestamp', {
          foreignTable: 'orders',
          ascending: false,
        })
        .single();

      if (portfolioResponse.error) {
        context.response.status = Status.InternalServerError;
        context.response.body = {
          error: 'Error getting the portfolio.',
        };

        return;
      }

      const portfolio = portfolioResponse.data;
      // Get the stocks of the portfolio

      const stockISINs = portfolio.positions
        .filter((position) => position.instrument_type === 'stock')
        .map((stock) => stock.isin)
        .filter((isin) => isin != null) as string[];

      const fundISINs = portfolio?.positions
        .filter((position) => position.instrument_type === 'fund')
        .map((fund) => fund.isin)
        .filter((isin) => isin != null) as string[];

      const stocksOfPortfolio = await getStocksByISINs(stockISINs);
      const fundsOfPortfolio = await getFundsByISINs(fundISINs);

      const stocksStatus = stocksOfPortfolio.map((stock) => {
        const ordersOfStock = portfolio?.orders.filter((order) =>
          order.isin === stock.company_infos?.isin
        );

        const totalAmount = ordersOfStock?.reduce((acc, order) => {
          acc += order.amount_changed ?? 0;

          return acc;
        }, 0)!;

        const averagePrice = Number((ordersOfStock?.reduce((acc, order) => {
          acc += order.price ?? 0;

          return acc;
        }, 0)! / ordersOfStock?.length!).toFixed(2));

        const averageValue = Number((totalAmount * averagePrice).toFixed(2));
        const currentValue = Number(
          (totalAmount * stock.price_snapshot!).toFixed(2),
        );
        const valueChange = Number((currentValue - averageValue).toFixed(2));
        const percentChange = Number(
          Number((valueChange / averageValue) * 100).toFixed(2),
        );

        return {
          name: stock.company_infos?.name,
          isin: stock.isin,
          totalAmount,
          averagePrice,
          currentPrice: stock.price_snapshot,
          averageValue,
          currentValue,
          percentChange,
          valueChange,
        };
      });

      const fundsStatus = fundsOfPortfolio.map((fund) => {
        const ordersOfFund = portfolio?.orders.filter((order) =>
          order.isin === fund.isin
        );

        const totalAmount = ordersOfFund?.reduce((acc, order) => {
          acc += order.amount_changed ?? 0;

          return acc;
        }, 0)!;

        const averagePrice = Number((ordersOfFund?.reduce((acc, order) => {
          acc += order.price ?? 0;

          return acc;
        }, 0)! / ordersOfFund?.length!).toFixed(2));

        const averageValue = Number((totalAmount * averagePrice).toFixed(2));
        const currentValue = Number(
          (totalAmount * fund.price_snapshot!).toFixed(2),
        );
        const valueChange = Number((currentValue - averageValue).toFixed(2));
        const percentChange = Number(
          Number((valueChange / averageValue) * 100).toFixed(2),
        );

        return {
          name: fund.name,
          isin: fund.isin,
          totalAmount,
          averagePrice,
          currentPrice: fund.price_snapshot,
          averageValue,
          currentValue,
          percentChange,
          valueChange,
        };
      });

      context.response.status = Status.OK;
      context.response.body = {
        data: {
          id: portfolio.id,
          name: portfolio.name,
          orders: portfolio.orders,
          stocks: stocksOfPortfolio,
          funds: fundsOfPortfolio,
          stocksStatus,
          fundsStatus,
          created_at: portfolio.created_at,
          updated_at: portfolio.updated_at,
        },
      };
    } catch (error) {
      context.response.status = Status.InternalServerError;
      context.response.body = {
        error: (error as Error).message,
      };
    }
  })
  .get('/instrument/:isin', async (context) => {
    const instrumentIsin = context.params.isin;

    try {
      const fundResponse = await supabase
        .from('funds')
        .select(`
          isin,
          description,
          distribution_frequency,
          exchange_id,
          focus,
          name,
          image_id,
          price_snapshot,
          type_id,
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
        .eq('isin', instrumentIsin)
        .single();

      if (fundResponse.data) {
        context.response.status = Status.OK;
        context.response.body = {
          data: fundResponse.data,
        };

        return;
      } else {
        const stockResponse = await supabase
          .from('stocks')
          .select(`
          isin,
          intl_symbol,
          name,
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
            target_price_high,
            target_price_average,
            target_price_low,
            recommendations_buy,
            recommendations_outperform,
            recommendations_hold,
            recommendations_underperform
          ),
          sectors (
            name,
            icon
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
          .eq('isin', instrumentIsin)
          .single();

        if (stockResponse.error) {
          context.response.status = Status.InternalServerError;
          context.response.body = {
            error: stockResponse.error,
          };

          return;
        }

        if (stockResponse.data) {
          context.response.status = Status.OK;
          context.response.body = {
            data: stockResponse.data,
          };

          return;
        }
      }
    } catch (error) {
      context.response.status = Status.InternalServerError;
      context.response.body = {
        error: (error as Error).message,
      };
    }
  });

export { router };
