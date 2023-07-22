import { parse } from 'std/flags/mod.ts';
import { bgYellow, green } from 'std/fmt/colors.ts';
import { TR_API_URL, TR_SESSION_KEY } from './constants.ts';
import { kv } from './kv/index.ts';

const flags = parse(Deno.args, {
  boolean: ['cli'],
});

const credentials = {
  phoneNumber: '',
  pin: '',
};

export async function authorize(reAuthorizedCallback?: () => void) {
  let processId = '';
  let loginCookies: string[] = [];

  try {
    console.log(green('Send login request.'));

    const loginResponse = await fetch(`${TR_API_URL}/v1/auth/web/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    loginCookies = loginResponse.headers.getSetCookie();

    const data = await loginResponse.json() as { processId: string };
    processId = data.processId;
  } catch (error) {
    console.log((error as Error).message);
  }

  // Exit if the process id is not there.
  if (processId == null) {
    throw new Error(
      'Process ID is missing. Try again to log in with the credentials.',
    );
  }

  // Wait until the user has entered the 2FA pin.
  const pin2FA = prompt(green('Enter the 2FA pin sent to your phone: '));

  try {
    console.log(green('Send 2FA request.'));

    const response2FA = await fetch(
      `${TR_API_URL}/v1/auth/web/login/${processId}/${pin2FA}`,
      {
        method: 'POST',
        headers: {
          'cookie': loginCookies.join(),
        },
      },
    );

    const trSessionString = response2FA.headers.getSetCookie().find((
      cookieString,
    ) => cookieString.includes('tr_session'));

    if (trSessionString) {
      const trSession = trSessionString.split('=')[1].replace('; Path', '');
      await kv.set([TR_SESSION_KEY], trSession);
    }
  } catch (error) {
    console.log((error as Error).message);
  }

  if (reAuthorizedCallback) {
    console.log(bgYellow('Callback after re-authorization.'));

    reAuthorizedCallback();
  }
}

if (flags.cli) {
  authorize();
}
