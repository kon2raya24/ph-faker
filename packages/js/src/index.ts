import { Rng } from './rng.js';
import { NameFaker } from './name.js';
import { AddressFaker } from './address.js';
import { PhoneFaker } from './phone.js';
import { IdFaker } from './id.js';
import { MoneyFaker } from './money.js';
import { BusinessFaker } from './business.js';

const DEFAULT_SEED = 0xC0DEFEED;

export class Faker {
  private rng: Rng;
  readonly name: NameFaker;
  readonly address: AddressFaker;
  readonly phone: PhoneFaker;
  readonly id: IdFaker;
  readonly money: MoneyFaker;
  readonly business: BusinessFaker;

  constructor(seed: number = DEFAULT_SEED) {
    this.rng = new Rng(seed);
    this.name = new NameFaker(this.rng);
    this.address = new AddressFaker(this.rng);
    this.phone = new PhoneFaker(this.rng);
    this.id = new IdFaker(this.rng);
    this.money = new MoneyFaker(this.rng);
    this.business = new BusinessFaker(this.rng);
  }

  seed(value: number): void {
    this.rng.setSeed(value);
  }
}

export const faker = new Faker();

export type { Gender } from './name.js';
export type { Region, Province } from './address.js';
export type { Network } from './phone.js';
export type { PesoOptions } from './money.js';
