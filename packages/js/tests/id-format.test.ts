import { describe, it, expect } from 'vitest';
import { Faker } from '../src/index.js';

// Format spec mirrors @ph-dev-utils/core validators. Keep in sync if ph-dev-utils
// changes its TIN/SSS/PhilHealth/Pag-IBIG digit-length rules.
const digits = (s: string) => s.replace(/\D/g, '');

describe('government ID generators produce format-valid values', () => {
  const f = new Faker(123);
  const SAMPLES = 1000;

  it('TIN with branch is exactly 12 digits', () => {
    for (let i = 0; i < SAMPLES; i++) {
      expect(digits(f.id.tin())).toHaveLength(12);
    }
  });

  it('TIN without branch is exactly 9 digits', () => {
    for (let i = 0; i < SAMPLES; i++) {
      expect(digits(f.id.tin(false))).toHaveLength(9);
    }
  });

  it('SSS is exactly 10 digits, formatted XX-XXXXXXX-X', () => {
    for (let i = 0; i < SAMPLES; i++) {
      const id = f.id.sss();
      expect(digits(id)).toHaveLength(10);
      expect(id).toMatch(/^\d{2}-\d{7}-\d$/);
    }
  });

  it('PhilHealth is exactly 12 digits, formatted XX-XXXXXXXXX-X', () => {
    for (let i = 0; i < SAMPLES; i++) {
      const id = f.id.philhealth();
      expect(digits(id)).toHaveLength(12);
      expect(id).toMatch(/^\d{2}-\d{9}-\d$/);
    }
  });

  it('Pag-IBIG is exactly 12 digits, formatted XXXX-XXXX-XXXX', () => {
    for (let i = 0; i < SAMPLES; i++) {
      const id = f.id.pagibig();
      expect(digits(id)).toHaveLength(12);
      expect(id).toMatch(/^\d{4}-\d{4}-\d{4}$/);
    }
  });
});
