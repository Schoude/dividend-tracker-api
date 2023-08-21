import { TR_API_URL, TR_SESSION_KEY } from '../../scraping/tr/constants.ts';
import { load } from 'std/dotenv/mod.ts';
import { kv } from '../../scraping/tr/kv/index.ts';
import { LoginOptions2FA } from './types.ts';

const env = await load();
const phoneNumber = env['PHONE'];
const pin = env['PIN'];

const credentials = {
  phoneNumber,
  pin,
};

export async function authorizeTR() {
  let processId = '';
  let loginCookies: string[] = [];

  try {
    const loginResponse = await fetch(`${TR_API_URL}/v1/auth/web/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    loginCookies = loginResponse.headers.getSetCookie();

    const trSessionString = loginResponse.headers.getSetCookie().find((
      cookieString,
    ) => cookieString.includes('tr_session'));

    if (trSessionString) {
      const trSession = trSessionString.split('=')[1].replace('; Path', '');
      await kv.set([TR_SESSION_KEY], trSession);

      return;
    }

    const data = await loginResponse.json() as { processId: string };
    processId = data.processId;

    return {
      processId,
      loginCookies: loginCookies.join(),
    };
  } catch (error) {
    console.log((error as Error).message);
  }
}

export async function auth2faTR(
  pin2FA: string,
  {
    processId,
    loginCookies,
  }: LoginOptions2FA,
) {
  try {
    const response2FA = await fetch(
      `${TR_API_URL}/v1/auth/web/login/${processId}/${pin2FA}`,
      {
        method: 'POST',
        headers: {
          'cookie': loginCookies,
        },
      },
    );

    const trSessionString = response2FA.headers.getSetCookie().find((
      cookieString,
    ) => cookieString.includes('tr_session'));

    if (trSessionString) {
      const trSession = trSessionString.split('=')[1].replace('; Path', '');
      return trSession;
    }
  } catch (error) {
    console.log((error as Error).message);
  }
}
