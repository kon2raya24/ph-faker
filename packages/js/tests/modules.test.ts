import { describe, it, expect } from 'vitest';
import { Faker } from '../src/index.js';

describe('module surface', () => {
  const f = new Faker(7);

  it('name.first returns a non-empty string for both genders', () => {
    expect(f.name.first('male')).toMatch(/\S/);
    expect(f.name.first('female')).toMatch(/\S/);
    expect(f.name.first()).toMatch(/\S/);
  });

  it('name.fullWithMiddle has three parts', () => {
    const parts = f.name.fullWithMiddle().split(' ');
    expect(parts.length).toBeGreaterThanOrEqual(3);
  });

  it('address.region returns a shape matching ph-dev-utils', () => {
    const r = f.address.region();
    expect(r).toHaveProperty('code');
    expect(r).toHaveProperty('name');
    expect(r).toHaveProperty('designation');
  });

  it('address.province has a region pointer', () => {
    const p = f.address.province();
    expect(p.region).toMatch(/^\d{2}[A-Z]?$/);
  });

  it('money.peso respects min/max', () => {
    for (let i = 0; i < 100; i++) {
      const v = f.money.peso({ min: 100, max: 200 });
      expect(v).toBeGreaterThanOrEqual(100);
      expect(v).toBeLessThanOrEqual(200.99);
    }
  });

  it('money.salary falls in the documented range', () => {
    for (let i = 0; i < 100; i++) {
      const v = f.money.salary();
      expect(v).toBeGreaterThanOrEqual(15000);
      expect(v).toBeLessThanOrEqual(80000.99);
    }
  });

  it('business.name returns a non-empty string', () => {
    for (let i = 0; i < 50; i++) {
      expect(f.business.name()).toMatch(/\S/);
    }
  });
});
