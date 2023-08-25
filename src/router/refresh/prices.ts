import { helpers, Router, Status } from 'oak';
import { updatePrices } from '../../middleware/updatePrices.ts';

const pricesRefreshRouter = new Router();

pricesRefreshRouter
  .prefix('/api')
  .get('/refresh/prices', updatePrices, (context) => {
    const query = helpers.getQuery(context) as { type: 'stock' | 'funds' };

    context.response.status = Status.OK;
    context.response.body = {
      message: `Prices updated for ${query.type}.`,
    };
  });

export { pricesRefreshRouter };
