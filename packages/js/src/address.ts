import { Rng } from './rng.js';
import { listCitiesMunicipalities } from '@ph-dev-utils/core';
import type { CityMunicipality } from '@ph-dev-utils/core';
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

// Cache once at module load — listCitiesMunicipalities() is a cloned slice each call.
const allCities: CityMunicipality[] = listCitiesMunicipalities();

export class AddressFaker {
  constructor(private rng: Rng) {}

  region(): Region {
    return this.rng.pick(regions);
  }

  province(): Province {
    return this.rng.pick(provinces);
  }

  /**
   * Random city or municipality from the PSA Q4 2024 PSGC dataset (1,634 entries).
   * @param opts filter by region (2-digit), province (4-digit), or isCity flag.
   */
  city(opts: { region?: string; province?: string; isCity?: boolean } = {}): CityMunicipality {
    let pool = allCities;
    if (opts.region !== undefined) pool = pool.filter((c) => c.region === opts.region);
    if (opts.province !== undefined) pool = pool.filter((c) => c.province === opts.province);
    if (opts.isCity !== undefined) pool = pool.filter((c) => c.isCity === opts.isCity);
    if (pool.length === 0) {
      throw new RangeError('AddressFaker.city: no entries match the given filter');
    }
    return this.rng.pick(pool);
  }

  street(): string {
    const pools = [streetWords.heroes, streetWords.flowers, streetWords.trees];
    const word = this.rng.pick(this.rng.pick(pools) as string[]);
    const type = this.rng.pick(streetWords.types);
    const number = this.rng.nextInt(1, 9999);
    return `${number} ${word} ${type}`;
  }

  /**
   * Single-line address — `street, province name, region name`.
   * Province-level only (v0.1 shape, preserved for backwards compat).
   */
  full(): string {
    const province = this.province();
    const region = regions.find((r) => r.code === province.region);
    return `${this.street()}, ${province.name}, ${region?.name ?? ''}`.trim();
  }

  /**
   * Address composed via the PSGC city/municipality dataset — `street, city, province, region`.
   * For HUC entries with no province, omits the province segment.
   *
   * @example
   *   faker.address.fullWithCity();
   *   // '4732 Mabini Street, City of Caloocan, Metro Manila, National Capital Region'
   */
  fullWithCity(): string {
    const city = this.city();
    const region = regions.find((r) => r.code === city.region);
    const province = city.province !== null ? provinces.find((p) => p.code === city.province) : null;
    const parts = [this.street(), city.name];
    if (province) parts.push(province.name);
    if (region) parts.push(region.name);
    return parts.join(', ');
  }
}
