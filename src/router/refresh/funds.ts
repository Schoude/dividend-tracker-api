import { Router, Status } from 'oak';

const fundsRefreshRouter = new Router();

fundsRefreshRouter
  .prefix('/api')
  .get('/refresh/funds/info', (context) => {
    context.response.status = Status.OK;
  })
  .get('/refresh/funds/dividends', (context) => {
    context.response.status = Status.OK;
  });

export { fundsRefreshRouter };
