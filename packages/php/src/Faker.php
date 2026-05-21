<?php

declare(strict_types=1);

namespace PhDevUtils\Faker;

final class Faker
{
    private const DEFAULT_SEED = 0x0DEFEED;

    private Rng $rng;
    public readonly Name $name;
    public readonly Address $address;
    public readonly Phone $phone;
    public readonly Id $id;
    public readonly Money $money;
    public readonly Business $business;
    public readonly DateFaker $date;
    private PayslipFaker $payslipFaker;

    public function __construct(int $seed = self::DEFAULT_SEED)
    {
        $this->rng = new Rng($seed);
        $this->name = new Name($this->rng);
        $this->address = new Address($this->rng);
        $this->phone = new Phone($this->rng);
        $this->id = new Id($this->rng);
        $this->money = new Money($this->rng);
        $this->business = new Business($this->rng);
        $this->date = new DateFaker($this->rng);
        $this->payslipFaker = new PayslipFaker($this->rng, $this->name, $this->id, $this->address, $this->money);
    }

    public function seed(int $value): void
    {
        $this->rng->setSeed($value);
    }

    /**
     * Generate a full fake payslip using phdevutils/payroll for the math.
     *
     * @param array{salary?: float, includeWT?: bool, nonTaxableAllowances?: float, period?: string} $opts
     */
    public function payslip(array $opts = []): array
    {
        return $this->payslipFaker->generate($opts);
    }
}
