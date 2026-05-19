<?php

declare(strict_types=1);

namespace PhDevUtils\Faker;

final class Name
{
    /** @var array<int, string> */
    private array $maleFirst;
    /** @var array<int, string> */
    private array $femaleFirst;
    /** @var array<int, string> */
    private array $last;

    public function __construct(private Rng $rng)
    {
        $this->maleFirst = DataLoader::load('first-names-male');
        $this->femaleFirst = DataLoader::load('first-names-female');
        $this->last = DataLoader::load('last-names');
    }

    public function first(?string $gender = null): string
    {
        $g = $gender ?? ($this->rng->next() < 0.5 ? 'male' : 'female');
        $pool = $g === 'male' ? $this->maleFirst : $this->femaleFirst;
        return $this->rng->pick($pool);
    }

    public function last(): string
    {
        return $this->rng->pick($this->last);
    }

    public function full(?string $gender = null): string
    {
        return $this->first($gender) . ' ' . $this->last();
    }

    // PH naming convention: middle name = mother's maiden surname.
    public function fullWithMiddle(?string $gender = null): string
    {
        return $this->first($gender) . ' ' . $this->last() . ' ' . $this->last();
    }
}
