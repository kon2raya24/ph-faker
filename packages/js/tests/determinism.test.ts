import { describe, it, expect } from 'vitest';
import { Faker } from '../src/index.js';

describe('seeded determinism', () => {
  it('same seed produces same sequence', () => {
    const a = new Faker(42);
    const b = new Faker(42);
    for (let i = 0; i < 50; i++) {
      expect(a.name.full()).toBe(b.name.full());
    }
  });

  it('different seeds diverge quickly', () => {
    const a = new Faker(1);
    const b = new Faker(2);
    const diffs = new Set<string>();
    for (let i = 0; i < 20; i++) {
      diffs.add(a.name.full());
      diffs.add(b.name.full());
    }
    // 40 draws from two seeds should produce more variety than a single seed.
    expect(diffs.size).toBeGreaterThan(10);
  });

  it('seed() resets the sequence', () => {
    const f = new Faker(42);
    const first = [f.name.full(), f.id.tin(), f.phone.mobile()];
    f.seed(42);
    const second = [f.name.full(), f.id.tin(), f.phone.mobile()];
    expect(second).toEqual(first);
  });
});
