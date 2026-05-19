<?php

declare(strict_types=1);

namespace PhDevUtils\Faker;

final class Money
{
    public function __construct(private Rng $rng) {}

    public function peso(int $min = 0, int $max = 10000): float
    {
        $whole = $this->rng->nextInt($min, $max);
        $centavos = $this->rng->nextInt(0, 99);
        return round($whole + $centavos / 100, 2);
    }

    public function salary(): float
    {
        return $this->peso(15000, 80000);
    }

    public function price(): float
    {
        return $this->peso(5, 500);
    }
}
