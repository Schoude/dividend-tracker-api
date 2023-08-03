import { Status } from 'https://deno.land/std@0.193.0/http/http_status.ts';
import { Router } from 'oak';
import { supabase } from '../supabase/client.ts';

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
  });

export { router };
