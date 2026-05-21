import { describe, it, expect } from 'vitest';
import { Faker } from '../src/index.js';

describe('v0.2 — faker.address.city + fullWithCity', () => {
  it('city() returns an entry from the PSGC dataset', () => {
    const f = new Faker(42);
    const c = f.address.city();
    expect(c.code).toMatch(/^\d{6}$/);
    expect(typeof c.name).toBe('string');
    expect(['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17']).toContain(c.region);
  });

  it('city({ region: "13" }) filters to NCR', () => {
    const f = new Faker(42);
    for (let i = 0; i < 5; i++) {
      expect(f.address.city({ region: '13' }).region).toBe('13');
    }
  });

  it('city({ isCity: true }) excludes municipalities', () => {
    const f = new Faker(42);
    for (let i = 0; i < 5; i++) {
      expect(f.address.city({ isCity: true }).isCity).toBe(true);
    }
  });

  it('throws when no entries match filter', () => {
    const f = new Faker(42);
    expect(() => f.address.city({ region: '99' })).toThrow(RangeError);
  });

  it('fullWithCity() returns a 3-4 segment address string', () => {
    const f = new Faker(42);
    const addr = f.address.fullWithCity();
    expect(addr).toMatch(/^\d+\s.+/); // starts with street number
    const segments = addr.split(',').map(s => s.trim());
    expect(segments.length).toBeGreaterThanOrEqual(3);
    expect(segments.length).toBeLessThanOrEqual(4);
  });
});

describe('v0.2 — faker.date', () => {
  it('holiday() returns a 2026 holiday by default', () => {
    const f = new Faker(42);
    const h = f.date.holiday();
    expect(h.date).toMatch(/^2026-\d{2}-\d{2}$/);
    expect(['regular', 'special_non_working', 'special_working']).toContain(h.type);
  });

  it('holiday({ year: 2025 }) returns 2025 holiday', () => {
    const f = new Faker(42);
    expect(f.date.holiday({ year: 2025 }).date).toMatch(/^2025-/);
  });

  it('workingDay() returns ISO date that is not a weekend and not a holiday', () => {
    const f = new Faker(42);
    for (let i = 0; i < 20; i++) {
      const iso = f.date.workingDay();
      expect(iso).toMatch(/^2026-\d{2}-\d{2}$/);
      const dow = new Date(`${iso}T00:00:00`).getDay();
      expect([0, 6]).not.toContain(dow); // not sun/sat
    }
  });

  it('anyDay() returns ISO date in the given year (no filtering)', () => {
    const f = new Faker(42);
    const iso = f.date.anyDay({ year: 2025 });
    expect(iso).toMatch(/^2025-\d{2}-\d{2}$/);
  });
});

describe('v0.2 — faker.payslip', () => {
  it('generates a complete payslip with employee + computation', () => {
    const f = new Faker(42);
    const p = f.payslip();
    expect(p.employee.fullName.length).toBeGreaterThan(0);
    expect(p.employee.tin).toMatch(/^\d{3}-\d{3}-\d{3}-\d{3}$/);
    expect(p.employee.sss).toMatch(/^\d{2}-\d{7}-\d$/);
    expect(p.period.type).toBe('monthly');
    expect(p.computation.gross).toBeGreaterThan(0);
    expect(p.computation.totalDeductions).toBeGreaterThan(0);
    expect(p.computation.net).toBeLessThan(p.computation.gross);
    expect(p.computation.withholdingTax).toBeDefined();
    expect(p.computation.netAfterTax).toBeDefined();
  });

  it('respects custom salary', () => {
    const f = new Faker(42);
    const p = f.payslip({ salary: 30000 });
    expect(p.computation.gross).toBe(30000);
    expect(p.computation.netAfterTax).toBe(26542.45); // ph-payroll worked example
  });

  it('includeWT: false omits tax fields (v0.1 shape)', () => {
    const f = new Faker(42);
    const p = f.payslip({ salary: 30000, includeWT: false });
    expect(p.computation.withholdingTax).toBeUndefined();
    expect(p.computation.netAfterTax).toBeUndefined();
    expect(p.computation.net).toBe(27550); // pre-tax
  });

  it('determinism: same seed → same payslip', () => {
    const a = new Faker(42).payslip();
    const b = new Faker(42).payslip();
    expect(a.employee.fullName).toBe(b.employee.fullName);
    expect(a.employee.tin).toBe(b.employee.tin);
    expect(a.computation.gross).toBe(b.computation.gross);
    expect(a.computation.net).toBe(b.computation.net);
  });
});
