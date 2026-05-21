import { Rng } from './rng.js';
import { NameFaker } from './name.js';
import { AddressFaker } from './address.js';
import { PhoneFaker } from './phone.js';
import { IdFaker } from './id.js';
import { MoneyFaker } from './money.js';
import { BusinessFaker } from './business.js';
import { DateFaker } from './date.js';
import { PayslipFaker } from './payslip.js';
import type { Payslip, PayslipOptions } from './payslip.js';

const DEFAULT_SEED = 0xC0DEFEED;

export class Faker {
  private rng: Rng;
  readonly name: NameFaker;
  readonly address: AddressFaker;
  readonly phone: PhoneFaker;
  readonly id: IdFaker;
  readonly money: MoneyFaker;
  readonly business: BusinessFaker;
  readonly date: DateFaker;
  private payslipFaker: PayslipFaker;

  constructor(seed: number = DEFAULT_SEED) {
    this.rng = new Rng(seed);
    this.name = new NameFaker(this.rng);
    this.address = new AddressFaker(this.rng);
    this.phone = new PhoneFaker(this.rng);
    this.id = new IdFaker(this.rng);
    this.money = new MoneyFaker(this.rng);
    this.business = new BusinessFaker(this.rng);
    this.date = new DateFaker(this.rng);
    this.payslipFaker = new PayslipFaker(this.rng, this.name, this.id, this.address, this.money);
  }

  seed(value: number): void {
    this.rng.setSeed(value);
  }

  /** Generate a full fake payslip using @ph-dev-utils/payroll for the math. */
  payslip(opts?: PayslipOptions): Payslip {
    return this.payslipFaker.generate(opts);
  }
}

export const faker = new Faker();

export type { Gender } from './name.js';
export type { Region, Province } from './address.js';
export type { Network } from './phone.js';
export type { PesoOptions } from './money.js';
export type { WorkingDayOptions } from './date.js';
export type { Payslip, PayslipOptions } from './payslip.js';
