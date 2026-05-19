import { Rng } from './rng.js';

export interface PesoOptions {
  min?: number;
  max?: number;
}

export class MoneyFaker {
  constructor(private rng: Rng) {}

  // Random peso amount with centavos. Default range ~ everyday purchase.
  peso(opts: PesoOptions = {}): number {
    const min = opts.min ?? 0;
    const max = opts.max ?? 10000;
    const whole = this.rng.nextInt(min, max);
    const centavos = this.rng.nextInt(0, 99);
    return Math.round((whole + centavos / 100) * 100) / 100;
  }

  // Realistic monthly salary range for PH (PHP 15,000 – 80,000 covers entry to mid-senior).
  salary(): number {
    return this.peso({ min: 15000, max: 80000 });
  }

  // Sari-sari–scale prices (5 – 500 pesos).
  price(): number {
    return this.peso({ min: 5, max: 500 });
  }
}
