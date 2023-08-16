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
import { oakCors } from 'cors';

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
  timestamp: optional(number()),
});

orderRouter
  .prefix('/api')
  .post(
    '/order/buy',
    oakCors({
      origin: /^.+localhost:(3000|8085)$/,
    }),
    async (context) => {
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
          timestamp,
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
            timestamp: timestamp ?? Date.now(),
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
    },
  )
  .post(
    '/order/sell',
    oakCors({
      origin: /^.+localhost:(3000|8085)$/,
    }),
    async (context) => {
      const body = await context.request.body({ type: 'json' }).value;

      try {
        const {
          portfolioId,
          currentAmount,
          amount,
          instrumentType,
          isin,
          price,
          type,
          name,
          timestamp,
        } = parse(OrderSchema, body);

        if (currentAmount == null) {
          context.response.status = Status.UnprocessableEntity;
          context.response.body = {
            error: 'Input for "currentAmount" needed.',
          };

          return;
        }

        const removePosition = currentAmount - amount <= 0;

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
            timestamp: timestamp ?? Date.now(),
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

        if (removePosition) {
          const positionsResponse = await supabase
            .from('positions')
            .delete()
            .eq('isin', isin);

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
    },
  );

export { orderRouter };
