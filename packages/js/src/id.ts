import { Rng } from './rng.js';

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

export class IdFaker {
  constructor(private rng: Rng) {}

  // BIR TIN: 9 digits (individual) or 12 digits (with 3-digit branch code), formatted XXX-XXX-XXX[-XXX].
  tin(withBranch = true): string {
    const a = pad(this.rng.nextInt(0, 999), 3);
    const b = pad(this.rng.nextInt(0, 999), 3);
    const c = pad(this.rng.nextInt(0, 999), 3);
    if (!withBranch) return `${a}-${b}-${c}`;
    const branch = pad(this.rng.nextInt(0, 999), 3);
    return `${a}-${b}-${c}-${branch}`;
  }

  // SSS: 10 digits formatted XX-XXXXXXX-X.
  sss(): string {
    const a = pad(this.rng.nextInt(0, 99), 2);
    const b = pad(this.rng.nextInt(0, 9999999), 7);
    const c = pad(this.rng.nextInt(0, 9), 1);
    return `${a}-${b}-${c}`;
  }

  // PhilHealth: 12 digits formatted XX-XXXXXXXXX-X.
  philhealth(): string {
    const a = pad(this.rng.nextInt(0, 99), 2);
    const b = pad(this.rng.nextInt(0, 999999999), 9);
    const c = pad(this.rng.nextInt(0, 9), 1);
    return `${a}-${b}-${c}`;
  }

  // Pag-IBIG MID: 12 digits formatted XXXX-XXXX-XXXX.
  pagibig(): string {
    const a = pad(this.rng.nextInt(0, 9999), 4);
    const b = pad(this.rng.nextInt(0, 9999), 4);
    const c = pad(this.rng.nextInt(0, 9999), 4);
    return `${a}-${b}-${c}`;
  }

  private letter(): string {
    return String.fromCharCode(65 + this.rng.nextInt(0, 25));
  }

  // PhilSys National ID (PhilSys Card Number): 16 digits formatted XXXX-XXXX-XXXX-XXXX.
  nationalID(): string {
    const groups = [0, 0, 0, 0].map(() => pad(this.rng.nextInt(0, 9999), 4));
    return groups.join('-');
  }

  // UMID Common Reference Number: 12 digits formatted XXXX-XXXXXXX-X.
  umid(): string {
    const a = pad(this.rng.nextInt(0, 9999), 4);
    const b = pad(this.rng.nextInt(0, 9999999), 7);
    const c = pad(this.rng.nextInt(0, 9), 1);
    return `${a}-${b}-${c}`;
  }

  // Philippine ePassport: 1 letter + 7 digits + 1 letter, e.g. "P1234567A".
  passport(): string {
    return `${this.letter()}${pad(this.rng.nextInt(0, 9999999), 7)}${this.letter()}`;
  }

  // PRC professional license / registration number: 7 digits.
  prc(): string {
    return pad(this.rng.nextInt(0, 9999999), 7);
  }
}
