import { Rng } from './rng.js';
import regionsData from '../data/regions.json' with { type: 'json' };
import provincesData from '../data/provinces.json' with { type: 'json' };
import streetWords from '../data/street-words.json' with { type: 'json' };

export interface Region {
  code: string;
  name: string;
  designation: string;
}

export interface Province {
  code: string;
  name: string;
  region: string;
}

const regions = regionsData as Region[];
const provinces = provincesData as Province[];

export class AddressFaker {
  constructor(private rng: Rng) {}

  region(): Region {
    return this.rng.pick(regions);
  }

  province(): Province {
    return this.rng.pick(provinces);
  }

  street(): string {
    const pools = [streetWords.heroes, streetWords.flowers, streetWords.trees];
    const word = this.rng.pick(this.rng.pick(pools) as string[]);
    const type = this.rng.pick(streetWords.types);
    const number = this.rng.nextInt(1, 9999);
    return `${number} ${word} ${type}`;
  }

  // Multi-line not used — keep single-line address composition simple.
  full(): string {
    const province = this.province();
    const region = regions.find((r) => r.code === province.region);
    return `${this.street()}, ${province.name}, ${region?.name ?? ''}`.trim();
  }
}
