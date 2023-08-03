import { Application } from 'oak';
import { router } from './src/router/index.ts';

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.use((ctx) => {
  ctx.response.body = 'Welcome to the Dividend Tracker API!';
});

await app.listen({ port: 8000 });
