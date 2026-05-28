<?php

declare(strict_types=1);

namespace PhDevUtils\Faker;

final class Id
{
    public function __construct(private Rng $rng) {}

    private function pad(int $n, int $width): string
    {
        return str_pad((string) $n, $width, '0', STR_PAD_LEFT);
    }

    // BIR TIN: 9 digits (individual) or 12 digits (with 3-digit branch code).
    public function tin(bool $withBranch = true): string
    {
        $a = $this->pad($this->rng->nextInt(0, 999), 3);
        $b = $this->pad($this->rng->nextInt(0, 999), 3);
        $c = $this->pad($this->rng->nextInt(0, 999), 3);
        if (!$withBranch) {
            return "{$a}-{$b}-{$c}";
        }
        $branch = $this->pad($this->rng->nextInt(0, 999), 3);
        return "{$a}-{$b}-{$c}-{$branch}";
    }

    public function sss(): string
    {
        $a = $this->pad($this->rng->nextInt(0, 99), 2);
        $b = $this->pad($this->rng->nextInt(0, 9999999), 7);
        $c = $this->pad($this->rng->nextInt(0, 9), 1);
        return "{$a}-{$b}-{$c}";
    }

    public function philhealth(): string
    {
        $a = $this->pad($this->rng->nextInt(0, 99), 2);
        $b = $this->pad($this->rng->nextInt(0, 999999999), 9);
        $c = $this->pad($this->rng->nextInt(0, 9), 1);
        return "{$a}-{$b}-{$c}";
    }

    public function pagibig(): string
    {
        $a = $this->pad($this->rng->nextInt(0, 9999), 4);
        $b = $this->pad($this->rng->nextInt(0, 9999), 4);
        $c = $this->pad($this->rng->nextInt(0, 9999), 4);
        return "{$a}-{$b}-{$c}";
    }

    private function letter(): string
    {
        return chr(65 + $this->rng->nextInt(0, 25));
    }

    // PhilSys National ID (PhilSys Card Number): 16 digits formatted XXXX-XXXX-XXXX-XXXX.
    public function nationalID(): string
    {
        $g = [];
        for ($i = 0; $i < 4; $i++) {
            $g[] = $this->pad($this->rng->nextInt(0, 9999), 4);
        }
        return implode('-', $g);
    }

    // UMID Common Reference Number: 12 digits formatted XXXX-XXXXXXX-X.
    public function umid(): string
    {
        $a = $this->pad($this->rng->nextInt(0, 9999), 4);
        $b = $this->pad($this->rng->nextInt(0, 9999999), 7);
        $c = $this->pad($this->rng->nextInt(0, 9), 1);
        return "{$a}-{$b}-{$c}";
    }

    // Philippine ePassport: 1 letter + 7 digits + 1 letter, e.g. "P1234567A".
    public function passport(): string
    {
        return $this->letter() . $this->pad($this->rng->nextInt(0, 9999999), 7) . $this->letter();
    }

    // PRC professional license / registration number: 7 digits.
    public function prc(): string
    {
        return $this->pad($this->rng->nextInt(0, 9999999), 7);
    }
}
