import { Rng } from './rng.js';
import maleFirstNames from '../../../data/first-names-male.json' with { type: 'json' };
import femaleFirstNames from '../../../data/first-names-female.json' with { type: 'json' };
import lastNames from '../../../data/last-names.json' with { type: 'json' };

export type Gender = 'male' | 'female';

export class NameFaker {
  constructor(private rng: Rng) {}

  first(gender?: Gender): string {
    const g = gender ?? (this.rng.next() < 0.5 ? 'male' : 'female');
    const pool = g === 'male' ? maleFirstNames : femaleFirstNames;
    return this.rng.pick(pool as string[]);
  }

  last(): string {
    return this.rng.pick(lastNames as string[]);
  }

  full(gender?: Gender): string {
    return `${this.first(gender)} ${this.last()}`;
  }

  // PH naming convention: middle name = mother's maiden surname.
  fullWithMiddle(gender?: Gender): string {
    return `${this.first(gender)} ${this.last()} ${this.last()}`;
  }
}
