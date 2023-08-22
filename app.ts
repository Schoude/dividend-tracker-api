import { Application } from 'oak';
import { router } from './src/router/index.ts';
import { authRouter } from './src/router/auth.ts';
import { oakCors } from 'cors';
import { orderRouter } from './src/router/order.ts';
import { trRouter } from './src/router/tr.ts';

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

app.use((ctx) => {
  ctx.response.body = 'Welcome to the Dividend Tracker API!';
});

await app.listen({ port: 8000 });
