<?php

declare(strict_types=1);

namespace PhDevUtils\Faker;

use PhDevUtils\Payroll\TakeHome;

final class PayslipFaker
{
    public function __construct(
        private Rng $rng,
        private Name $name,
        private Id $id,
        private Address $address,
        private Money $money,
    ) {}

    /**
     * Generate a complete fake PH payslip — fake identity + computed deductions
     * via phdevutils/payroll's TakeHome::netTakeHome.
     *
     * @param array{salary?: float, includeWT?: bool, nonTaxableAllowances?: float, period?: string} $opts
     * @return array{employee: array, period: array, computation: array}
     */
    public function generate(array $opts = []): array
    {
        $salary = (float) ($opts['salary'] ?? $this->money->salary());
        $includeWT = $opts['includeWT'] ?? true;
        $nonTaxableAllowances = (float) ($opts['nonTaxableAllowances'] ?? 0);

        $computation = TakeHome::netTakeHome($salary, [
            'includeWT' => $includeWT,
            'nonTaxableAllowances' => $nonTaxableAllowances,
        ]);

        return [
            'employee' => [
                'fullName' => $this->name->fullWithMiddle(),
                'tin' => $this->id->tin(),
                'sss' => $this->id->sss(),
                'philhealth' => $this->id->philhealth(),
                'pagibig' => $this->id->pagibig(),
                'address' => $this->address->full(),
            ],
            'period' => ['type' => 'monthly'],
            'computation' => $computation,
        ];
    }
}
