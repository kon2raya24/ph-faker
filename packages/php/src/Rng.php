<?php

declare(strict_types=1);

namespace PhDevUtils\Faker;

/**
 * Seeded deterministic PRNG. Each Rng owns its own \Random\Engine\Mt19937
 * engine, so independent Faker instances do not interfere with each other.
 * Same seed → same sequence within a PHP runtime. Cross-language compat
 * with the JS package is not guaranteed.
 */
final class Rng
{
    private \Random\Randomizer $randomizer;

    public function __construct(int $seed)
    {
        $this->randomizer = new \Random\Randomizer(new \Random\Engine\Mt19937($seed));
    }

    public function setSeed(int $seed): void
    {
        $this->randomizer = new \Random\Randomizer(new \Random\Engine\Mt19937($seed));
    }

    public function nextInt(int $min, int $maxInclusive): int
    {
        return $this->randomizer->getInt($min, $maxInclusive);
    }

    public function next(): float
    {
        // [0, 1) — 30-bit slice keeps math identical regardless of int size.
        return $this->nextInt(0, (1 << 30) - 1) / (1 << 30);
    }

    /**
     * @template T
     * @param  array<int, T> $arr
     * @return T
     */
    public function pick(array $arr): mixed
    {
        if ($arr === []) {
            throw new \InvalidArgumentException('Rng::pick: empty array');
        }
        $arr = array_values($arr);
        return $arr[$this->nextInt(0, count($arr) - 1)];
    }
}
