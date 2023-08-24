import { Router, Status } from 'oak';

const watchlistRefreshRouter = new Router();

watchlistRefreshRouter
  .prefix('/api')
  .get('/refresh/watchlist', (context) => {
    context.response.status = Status.OK;
  });

export { watchlistRefreshRouter };
