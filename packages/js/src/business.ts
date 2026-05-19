import { Rng } from './rng.js';
import businessWords from '../../../data/business-words.json' with { type: 'json' };
import maleFirstNames from '../../../data/first-names-male.json' with { type: 'json' };
import femaleFirstNames from '../../../data/first-names-female.json' with { type: 'json' };
import lastNames from '../../../data/last-names.json' with { type: 'json' };

export class BusinessFaker {
  constructor(private rng: Rng) {}

  name(): string {
    // Three composition patterns, weighted by feel.
    const pattern = this.rng.nextInt(1, 3);

    if (pattern === 1) {
      // "Aling Nena Sari-Sari Store"
      const honorific = this.rng.pick(businessWords.honorifics);
      const isAling = honorific === 'Aling' || honorific === 'Nanay' || honorific === 'Lola' || honorific === 'Ate';
      const givenPool = (isAling ? femaleFirstNames : maleFirstNames) as string[];
      const given = this.rng.pick(givenPool);
      const suffix = this.rng.pick(businessWords.suffixes);
      return `${honorific} ${given} ${suffix}`;
    }

    if (pattern === 2) {
      // "RJ Trading", "JM Enterprises"
      const initials = this.rng.pick(businessWords.initials_words);
      const suffix = this.rng.pick(businessWords.suffixes);
      return `${initials} ${suffix}`;
    }

    // pattern === 3: "Doon Sa Kanto Cafe", "Tindahan ni Reyes"
    const phrase = this.rng.pick(businessWords.place_flavored);
    if (phrase === 'Tindahan ni') {
      const lastName = this.rng.pick(lastNames as string[]);
      return `${phrase} ${lastName}`;
    }
    const suffix = this.rng.pick(businessWords.suffixes);
    return `${phrase} ${suffix}`;
  }
}
