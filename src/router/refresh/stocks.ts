import { Router, Status } from 'oak';
import { updateStockDetails } from '../../middleware/update-stock-details.ts';

const stocksRefreshRouter = new Router();

stocksRefreshRouter
  .prefix('/api')
  .get('/refresh/stocks/infos', updateStockDetails, (context) => {
    context.response.status = Status.OK;
    context.response.body = {
      message: `Stock Infos updated.`,
    };
  })
  .get('/refresh/stocks/dividends', (context) => {
    context.response.status = Status.OK;
  });

export { stocksRefreshRouter };
