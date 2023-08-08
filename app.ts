import { Application } from 'oak';
import { router } from './src/router/index.ts';
import { authRouter } from './src/router/auth.ts';
import { oakCors } from 'cors';

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

app.use((ctx) => {
  ctx.response.body = 'Welcome to the Dividend Tracker API!';
});

app.use(oakCors());

await app.listen({ port: 8000 });
