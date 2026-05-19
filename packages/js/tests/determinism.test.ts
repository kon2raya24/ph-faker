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

  it('two instances do not share state', () => {
    // Sequence from a Faker(7) used alone.
    const solo = new Faker(7);
    const soloSeq = Array.from({ length: 10 }, () => solo.name.full());

    // Same Faker(7) used while another Faker(99) is also drawing.
    // If state leaks globally, soloSeq2 would diverge from soloSeq.
    const a = new Faker(7);
    const b = new Faker(99);
    const soloSeq2: string[] = [];
    for (let i = 0; i < 10; i++) {
      soloSeq2.push(a.name.full());
      b.name.full(); // discard — must NOT influence `a`
    }
    expect(soloSeq2).toEqual(soloSeq);
  });
});
