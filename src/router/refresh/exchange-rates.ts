import { Router, Status } from 'oak';

const exchangeRatesRefreshRouter = new Router();

exchangeRatesRefreshRouter
  .prefix('/api')
  .get('/refresh/exchange-rates', (context) => {
    context.response.status = Status.OK;
  });

export { exchangeRatesRefreshRouter };
