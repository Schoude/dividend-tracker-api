import { supabase } from '../../../../src/supabase/client.ts';
import { etfDetails } from '../../output/etf-details.ts';
import { instruments } from '../../output/instruments.ts';

const allSectorsInstruments = instruments.flatMap((instrument) => {
  return instrument.tags
    .filter((tag) => tag.type === 'sector')
    .map((sector) => ({
      sector_id: sector.id,
      name: sector.name,
      icon: sector.icon,
    }));
});

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
});

const allSectors = [
  ...allSectorsInstruments,
  ...allSectorsETFs,
];

const aggregatedSectors = new Map(
  allSectors.map((sector) => [sector?.sector_id, sector]),
);

export const unitSectors = [...aggregatedSectors.values()];

const { data } = await supabase.from('sectors').insert(unitSectors).select();

console.log(data);
