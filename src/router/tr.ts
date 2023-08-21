import { maxLength, object, parse } from 'valibot';
import { Router } from 'oak';
import { string } from 'valibot';
import { auth2faTR, authorizeTR } from '../tr/auth.ts';
import { Status } from 'https://deno.land/std@0.193.0/http/http_status.ts';
import { TR_SESSION_KEY } from '../../scraping/tr/constants.ts';
import { kv } from '../../scraping/tr/kv/index.ts';

const trRouter = new Router();

const Auth2faSchema = object({
  pin: string([maxLength(4)]),
  processId: string(),
  loginCookies: string(),
});

trRouter
  .prefix('/api/tr')
  .get('/login', async (context) => {
    const authResult = await authorizeTR();

    if (authResult == null) {
      context.response.status = Status.OK;
      context.response.body = {
        message: 'Succesfully logged in for TR.',
      };

      return;
    }

    context.response.status = Status.Unauthorized;
    context.response.body = {
      data: authResult,
    };
  })
  .post('/login/2fa', async (context) => {
    const body = await context.request.body({ type: 'json' }).value;

    console.log(body);

    const data = parse(Auth2faSchema, body);

    const trSession = await auth2faTR(data.pin, {
      processId: data.processId,
      loginCookies: data.loginCookies,
    });

    if (trSession == null) {
      context.response.status = Status.Unauthorized;
      context.response.body = {
        message: '2FA login failed for TR',
      };

      return;
    }

    await kv.set([TR_SESSION_KEY], trSession);

    context.response.status = Status.OK;
    context.response.body = {
      message: 'Succesfully logged in with 2FA for TR.',
      data: {
        trSession,
      },
    };
  });

export { trRouter };