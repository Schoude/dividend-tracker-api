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

      context.response.status = Status.OK;
      context.response.body = {
        data: {
          name: portfolio.name,
          stocks: stocksOfPortfolio,
          funds: fundsOfPortfolio,
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
  });

export { router };
