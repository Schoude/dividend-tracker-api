import { Router, Status } from 'oak';

const stocksRefreshRouter = new Router();

stocksRefreshRouter
  .prefix('/api')
  .get('/refresh/stocks/infos', (context) => {
    context.response.status = Status.OK;
  })
  .get('/refresh/stocks/dividends', (context) => {
    context.response.status = Status.OK;
  });

export { stocksRefreshRouter };
