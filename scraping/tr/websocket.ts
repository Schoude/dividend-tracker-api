import { bgRed } from 'std/fmt/colors.ts';
import { authorize } from './auth.ts';
import { TR_SESSION_KEY, TR_WS_URL } from './constants.ts';
import { kv } from './kv/index.ts';

export async function createTrSocket() {
  const TR_SESSION = (await kv.get([TR_SESSION_KEY])).value;

  if (TR_SESSION == null) {
    console.log(
      bgRed('tr_session token is missing. Trying to re-authenticate...'),
    );
    await authorize();
  }

  const trSocket = new WebSocket(TR_WS_URL);
  return { trSocket, TR_SESSION };
}
