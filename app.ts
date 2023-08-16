import { Application } from 'oak';
import { router } from './src/router/index.ts';
import { authRouter } from './src/router/auth.ts';
import { oakCors } from 'cors';
import { orderRouter } from './src/router/order.ts';

const app = new Application();

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(orderRouter.routes());
app.use(orderRouter.allowedMethods());

app.use((ctx) => {
  ctx.response.body = 'Welcome to the Dividend Tracker API!';
});

app.use(oakCors());

await app.listen({ port: 8000 });
