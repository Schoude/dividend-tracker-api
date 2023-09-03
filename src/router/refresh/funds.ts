import { Router, Status } from 'oak';
import { updateDividendsFund } from '../../middleware/update-dividends-funds.ts';

const fundsRefreshRouter = new Router();

fundsRefreshRouter
  .prefix('/api')
  .get('/refresh/funds/info', (context) => {
    context.response.status = Status.OK;
  })
  .get('/refresh/funds/dividends', updateDividendsFund, (context) => {
    context.response.status = Status.OK;
  });

export { fundsRefreshRouter };
