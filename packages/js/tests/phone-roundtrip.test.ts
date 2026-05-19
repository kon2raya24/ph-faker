import { describe, it, expect } from 'vitest';
import { Faker } from '../src/index.js';
import prefixes from '../../../data/network-prefixes.json' with { type: 'json' };

// Inline-mirror of ph-dev-utils' parseMobile prefix→network lookup. Keep in sync
// if data/network-prefixes.json adds/removes a network.
const NETWORK_MAP: Record<string, string> = {};
for (const [network, list] of Object.entries(prefixes)) {
  if (network.startsWith('_')) continue;
  for (const p of list as string[]) NETWORK_MAP[p] = network;
}

describe('generated phone numbers carry the right network prefix', () => {
  const f = new Faker(999);

  it('Globe numbers begin with a Globe prefix in E.164', () => {
    for (let i = 0; i < 200; i++) {
      const num = f.phone.mobileByNetwork('Globe');
      // +63XXX... → strip +63, prepend 0 → 0XXX
      const prefix = '0' + num.slice(3, 6);
      expect(NETWORK_MAP[prefix]).toBe('Globe');
    }
  });

  it('Smart numbers begin with a Smart prefix', () => {
    for (let i = 0; i < 200; i++) {
      const num = f.phone.mobileByNetwork('Smart');
      const prefix = '0' + num.slice(3, 6);
      expect(NETWORK_MAP[prefix]).toBe('Smart');
    }
  });

  it('DITO numbers begin with a DITO prefix', () => {
    for (let i = 0; i < 200; i++) {
      const num = f.phone.mobileByNetwork('DITO');
      const prefix = '0' + num.slice(3, 6);
      expect(NETWORK_MAP[prefix]).toBe('DITO');
    }
  });

  it('mobile() returns a +63 E.164 number with 12 total digits after the +', () => {
    for (let i = 0; i < 200; i++) {
      const num = f.phone.mobile();
      expect(num).toMatch(/^\+63\d{10}$/);
    }
  });

  it('landline() uses a real area code with a complete subscriber', () => {
    for (let i = 0; i < 200; i++) {
      const num = f.phone.landline();
      expect(num).toMatch(/^\(0\d{1,2}\) \d{3,4}-\d{4}$/);
    }
  });
});
