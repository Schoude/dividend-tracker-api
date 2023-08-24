import { Application } from 'oak';
import { router } from './src/router/index.ts';
import { authRouter } from './src/router/auth.ts';
import { oakCors } from 'cors';
import { orderRouter } from './src/router/order.ts';
import { trRouter } from './src/router/tr.ts';
import { stocksRefreshRouter } from './src/router/refresh/stocks.ts';
import { fundsRefreshRouter } from './src/router/refresh/funds.ts';
import { watchlistRefreshRouter } from './src/router/refresh/watchlist.ts';

const app = new Application();

app.use(oakCors({
  origin: [
    /^.+localhost:(3000|8085)$/,
  ],
}));

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(orderRouter.routes());
app.use(orderRouter.allowedMethods());
app.use(trRouter.routes());
app.use(trRouter.allowedMethods());
app.use(stocksRefreshRouter.routes());
app.use(stocksRefreshRouter.allowedMethods());
app.use(fundsRefreshRouter.routes());
app.use(fundsRefreshRouter.allowedMethods());
app.use(watchlistRefreshRouter.routes());
app.use(watchlistRefreshRouter.allowedMethods());

app.use((ctx) => {
  ctx.response.body = 'Welcome to the Dividend Tracker API!';
});

await app.listen({ port: 8000 });
