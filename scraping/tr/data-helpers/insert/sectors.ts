import { supabase } from '../../../../src/supabase/client.ts';
import { etfDetails } from '../../output/etf-details.ts';
import { instruments } from '../../output/instruments.ts';
import { instrumentsWatchlist } from '../../output/watchlist-instruments.ts';

interface SectorDB {
  sector_id: string;
  name: string;
  icon: string;
}

const allSectorsInstruments = instruments.flatMap((instrument) => {
  return instrument.tags
    .filter((tag) => tag.type === 'sector')
    .map((sector) => ({
      sector_id: sector.id,
      name: sector.name,
      icon: sector.icon,
    }));
});

const allSectorsInstrumentsWatchlist = instrumentsWatchlist.flatMap(
  (instrument) => {
    return instrument.tags
      .filter((tag) => tag.type === 'sector')
      .map((sector) => ({
        sector_id: sector.id,
        name: sector.name,
        icon: sector.icon,
      }));
  },
);

const allSectorsETFs = etfDetails.flatMap((etf) => {
  return etf.composition?.flatMap((c) => {
    return c.tags
      ?.filter((tag) => tag.type === 'sector')
      .map((sector) => ({
        sector_id: sector.id,
        name: sector.name,
        icon: sector.icon,
      }));
  });
}) as SectorDB[];

const allSectors: SectorDB[] = [
  ...allSectorsInstruments,
  ...allSectorsInstrumentsWatchlist,
  ...allSectorsETFs,
];

const aggregatedSectors = new Map(
  allSectors.map((sector) => [sector?.sector_id, sector]),
);

export const unitSectors = [...aggregatedSectors.values()];

const { data, error } = await supabase.from('sectors').insert(unitSectors)
  .select();

console.log({ error });
console.log({ data });
