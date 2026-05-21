import { netTakeHome } from '@ph-dev-utils/payroll';
import type { NetTakeHome } from '@ph-dev-utils/payroll';
import { Rng } from './rng.js';
import type { NameFaker } from './name.js';
import type { IdFaker } from './id.js';
import type { AddressFaker } from './address.js';
import type { MoneyFaker } from './money.js';

export interface PayslipOptions {
  /** Override monthly gross salary. Defaults to `faker.money.salary()`. */
  salary?: number;
  /** If true (default), populate `withholdingTax` / `taxableIncome` / `netAfterTax`. */
  includeWT?: boolean;
  /** Override non-taxable allowances passed to ph-payroll. Default 0. */
  nonTaxableAllowances?: number;
  /** Payroll period (currently only monthly is supported in `netTakeHome`). */
  period?: 'monthly';
}

export interface Payslip {
  /** Fake employee identity. */
  employee: {
    fullName: string;
    tin: string;
    sss: string;
    philhealth: string;
    pagibig: string;
    address: string;
  };
  /** Payroll period info. */
  period: {
    type: 'monthly';
  };
  /** Full deduction + take-home breakdown from `@ph-dev-utils/payroll`. */
  computation: NetTakeHome;
}

export class PayslipFaker {
  constructor(
    private rng: Rng,
    private name: NameFaker,
    private id: IdFaker,
    private address: AddressFaker,
    private money: MoneyFaker,
  ) {}

  /**
   * Generate a complete fake PH payslip — fake identity + computed deductions
   * via `@ph-dev-utils/payroll`'s `netTakeHome`.
   *
   * Defaults: random monthly salary (faker.money.salary()), WT included.
   *
   * @example
   *   faker.payslip();
   *   // {
   *   //   employee: { fullName: 'Maria Santos', tin: '...', ... },
   *   //   period: { type: 'monthly' },
   *   //   computation: { gross: 30000, ..., netAfterTax: 26542.45 }
   *   // }
   */
  generate(opts: PayslipOptions = {}): Payslip {
    const salary = opts.salary ?? this.money.salary();
    const includeWT = opts.includeWT ?? true;
    const nonTaxableAllowances = opts.nonTaxableAllowances ?? 0;

    const computation = netTakeHome(salary, {
      includeWT,
      nonTaxableAllowances,
    });

    return {
      employee: {
        fullName: this.name.fullWithMiddle(),
        tin: this.id.tin(),
        sss: this.id.sss(),
        philhealth: this.id.philhealth(),
        pagibig: this.id.pagibig(),
        address: this.address.full(),
      },
      period: { type: 'monthly' },
      computation,
    };
  }
}
