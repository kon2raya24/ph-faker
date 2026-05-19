<?php

declare(strict_types=1);

namespace PhDevUtils\Faker;

/**
 * Seeded deterministic PRNG using PHP's Mt19937 engine via the \Random\Randomizer
 * API (PHP 8.2+) with a fallback to mt_srand/mt_rand for PHP 8.1. Same seed →
 * same sequence within a PHP version. Cross-language compat with the JS package
 * is not guaranteed.
 */
final class Rng
{
    private ?\Random\Randomizer $randomizer = null;
    private int $seed;

    public function __construct(int $seed)
    {
        $this->seed = $seed;
        $this->reset();
    }

    public function setSeed(int $seed): void
    {
        $this->seed = $seed;
        $this->reset();
    }

    private function reset(): void
    {
        if (class_exists(\Random\Engine\Mt19937::class)) {
            $engine = new \Random\Engine\Mt19937($this->seed);
            $this->randomizer = new \Random\Randomizer($engine);
        } else {
            mt_srand($this->seed);
            $this->randomizer = null;
        }
    }

    public function nextInt(int $min, int $maxInclusive): int
    {
        if ($this->randomizer !== null) {
            return $this->randomizer->getInt($min, $maxInclusive);
        }
        return mt_rand($min, $maxInclusive);
    }

    public function next(): float
    {
        // [0, 1) — use a 30-bit slice to stay safely inside PHP_INT_MAX on 32-bit too.
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
