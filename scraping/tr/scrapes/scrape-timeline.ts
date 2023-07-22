import { bgRed, bold, green } from 'std/fmt/colors.ts';
import {
  TR_OUTPUT_FOLDER_PATH,
  TR_SESSION_KEY,
  WS_CONNECTION_TYPE,
} from '../constants.ts';
import { kv } from '../kv/index.ts';
import { extractJSONFromString, extractSubId } from '../utils.ts';
import { createTrSocket } from '../websocket.ts';
import { parse } from 'std/flags/mod.ts';
import { Timeline, TimelineDatum } from '../types/timeline.ts';
import { instruments } from '../output/instruments.ts';
import { instrumentsWatchlist } from '../output/watchlist-instruments.ts';
import { InstrumentSaveable } from '../types/instrument.ts';
import {
  TimelineDetail,
  TimelineOrderDetail,
} from '../types/timeline-detail.ts';
import { authorize } from '../auth.ts';

const flags = parse(Deno.args, {
  boolean: ['cli'],
});

const availableInstruments: string[] =
  ([...instruments, ...instrumentsWatchlist] as (InstrumentSaveable)[])
    .map((instrument) => instrument.company.name);

const timelineResults: TimelineDatum[] = [];
const timeLineDetails: TimelineOrderDetail[] = [];

export async function scrapeTimeline() {
  const { trSocket, TR_SESSION } = await createTrSocket();

  trSocket.onopen = () => {
    trSocket.send(
      'connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 114.0.0","clientId":"app.traderepublic.com","clientVersion":"1.22.5"}',
    );

    const sub =
      `sub 1 {"type": "${WS_CONNECTION_TYPE.TIMELINE}", "token": "${TR_SESSION}"}`;

    trSocket.send(
      sub,
    );
  };

  trSocket.onmessage = async (event) => {
    if (event.data === 'connected' || !event.data.includes('{')) {
      return;
    }

    const jsonString = extractJSONFromString<string>(event.data, {
      parse: false,
    });

    if (jsonString.includes('AUTHENTICATION_ERROR')) {
      console.log(bgRed('tr_session token has expired or has been revoked.'));

      await kv.delete([TR_SESSION_KEY]);

      await authorize(scrapeTimeline);
      return;
    }

    const subId = extractSubId(event.data);
    console.log(subId);

    if (subId !== 1) {
      console.log('timeline detail');
      const timelineDetail = JSON.parse(jsonString) as TimelineDetail;

      const isRegular = timelineDetail.titleText.includes('Kauf') ||
        timelineDetail.titleText.includes('Verkauf');

      if (isRegular) {
        const amountRegular = timelineDetail.sections.find((section) =>
          section.title === 'Übersicht'
        )?.data?.find((d) => d.title === 'Anzahl')?.detail?.value;
        const priceRegular = timelineDetail.sections.find((section) =>
          section.title === 'Übersicht'
        )?.data?.find((d) => d.title === 'Preis')?.detail?.value;

        timeLineDetails.push({
          id: timelineDetail.id,
          type: 'buy',
          amount: amountRegular!,
          name: timelineDetail.titleText.replace('Kauf ', ''),
          price: priceRegular!,
        });
      } else {
        const costsSavingPlan = Math.abs(
          timelineDetail.sections.find((section) =>
            section.title === 'Historie'
          )?.data?.find((d) => d.title === 'Ausgeführt')?.cashChangeAmount!,
        );

        const priceSavingsPlan = Number(
          timelineDetail.sections.find((section) =>
            section.title === 'Historie'
          )?.data?.find((d) => d.title === 'Ausgeführt')?.body?.match(
            /\d+(,\d+)/,
          )?.[0].replace(',', '.'),
        );
        const amountSavingsPlan = Number(
          (costsSavingPlan / priceSavingsPlan).toFixed(6),
        );

        timeLineDetails.push({
          id: timelineDetail.id,
          type: 'buy',
          amount: amountSavingsPlan,
          name: timelineDetail.titleText,
          price: priceSavingsPlan!,
        });
      }

      trSocket.send(`unsub ${subId}`);
    } else {
      console.log('timeline list');
      trSocket.send('unsub 1');

      const timeline = JSON.parse(jsonString) as Timeline;

      const inlcludedData = timeline.data.filter((item) => {
        return (item.data.body?.includes('Kauf zu') ||
          item.data.body?.includes('Verkauf zu') ||
          item.data.body?.includes('Sparplan ausgeführt')) &&
          availableInstruments.includes(item.data.title);
      });

      // Timeline details for each included.
      inlcludedData.forEach((data, index) => {
        const sub = `sub ${
          timelineResults.length + index + 2
        } {"type": "${WS_CONNECTION_TYPE.TIMELINE_DETAIL}", "id": "${data.data.id}", "token": "${TR_SESSION}"}`;

        trSocket.send(
          sub,
        );
      });

      // re-sub to the timeline always with the first entry of the result as "after"
      // until there is no more "after" in "cursors" in the response
      if (timeline.cursors.after) {
        timelineResults.push(...inlcludedData);

        const sub =
          `sub 1 {"type": "${WS_CONNECTION_TYPE.TIMELINE}", "after": "${timeline.cursors.after}", "token": "${TR_SESSION}"}`;

        trSocket.send(
          sub,
        );
      } else {
        if (timelineResults.length == timeLineDetails.length) {
          trSocket.close();
        }
      }
    }
  };

  trSocket.onclose = () => {
    const fileContent = `
    import type { TimelineDatum } from '../types/timeline.ts';
    export const timeline: TimelineDatum[] = ${
      JSON.stringify(timelineResults)
    }`;

    Deno.writeTextFileSync(
      `${TR_OUTPUT_FOLDER_PATH}/timeline.ts`,
      fileContent,
    );

    Deno.writeTextFileSync(
      `${TR_OUTPUT_FOLDER_PATH}/timeline-details.ts`,
      `import type { TimelineOrderDetail } from '../types/timeline-detail.ts';
      export const timelineDetails: TimelineOrderDetail[] = ${
        JSON.stringify(timeLineDetails)
      };`,
    );

    console.log(
      green(
        bold(
          `Timeline scraped. ${timelineResults.length} Items, ${timeLineDetails.length} Details`,
        ),
      ),
    );
  };
}

if (flags.cli) {
  scrapeTimeline();
}
