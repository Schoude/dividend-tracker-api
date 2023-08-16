import { Router, Status } from 'oak';

const orderRouter = new Router();

import {
  boolean,
  literal,
  maxLength,
  number,
  object,
  optional,
  parse,
  string,
  union,
  type ValiError,
} from 'valibot';
import { supabase } from '../supabase/client.ts';

const OrderSchema = object({
  portfolioId: number(),
  isin: string([maxLength(12)]),
  name: string(),
  currentAmount: optional(number()),
  amount: number(),
  price: number(),
  isNew: optional(boolean()),
  type: union([literal('buy'), literal('sell')]),
  instrumentType: union([literal('stock'), literal('fund')]),
});

orderRouter
  .prefix('/api')
  .post('/order/buy', async (context) => {
    const body = await context.request.body({ type: 'json' }).value;

    try {
      const {
        isNew,
        portfolioId,
        amount,
        instrumentType,
        isin,
        price,
        type,
        name,
      } = parse(OrderSchema, body);

      const orderResponse = await supabase
        .from('orders')
        .insert({
          portfolio_id: portfolioId,
          amount_changed: amount,
          type,
          instrument_type: instrumentType,
          isin,
          name,
          price,
          order_id: crypto.randomUUID(),
          timestamp: Date.now(),
        })
        .select('*')
        .single();

      if (orderResponse.error) {
        context.response.status = Status.UnprocessableEntity;
        context.response.body = {
          error: orderResponse.error,
        };

        return;
      }

      if (isNew) {
        const positionsResponse = await supabase
          .from('positions')
          .insert({
            isin,
            portfolio_id: portfolioId,
            instrument_type: instrumentType,
          })
          .single();

        if (positionsResponse.error) {
          context.response.status = Status.UnprocessableEntity;
          context.response.body = {
            error: positionsResponse.error,
          };

          return;
        }
      }

      context.response.status = Status.Created;
      context.response.body = {
        data: orderResponse.data,
      };
    } catch (error) {
      context.response.status = Status.UnprocessableEntity;
      context.response.body = {
        error: (error as ValiError).message,
      };
    }
  });

export { orderRouter };
