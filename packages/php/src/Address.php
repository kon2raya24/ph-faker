<?php

declare(strict_types=1);

namespace PhDevUtils\Faker;

final class Address
{
    /** @var array<int, array{code: string, name: string, designation: string}> */
    private array $regions;
    /** @var array<int, array{code: string, name: string, region: string}> */
    private array $provinces;
    /** @var array<string, array<int, string>> */
    private array $streetWords;

    public function __construct(private Rng $rng)
    {
        $this->regions = DataLoader::load('regions');
        $this->provinces = DataLoader::load('provinces');
        $this->streetWords = DataLoader::load('street-words');
    }

    /** @return array{code: string, name: string, designation: string} */
    public function region(): array
    {
        return $this->rng->pick($this->regions);
    }

    /** @return array{code: string, name: string, region: string} */
    public function province(): array
    {
        return $this->rng->pick($this->provinces);
    }

    public function street(): string
    {
        $pools = [$this->streetWords['heroes'], $this->streetWords['flowers'], $this->streetWords['trees']];
        $word = $this->rng->pick($this->rng->pick($pools));
        $type = $this->rng->pick($this->streetWords['types']);
        $number = $this->rng->nextInt(1, 9999);
        return "{$number} {$word} {$type}";
    }

    public function full(): string
    {
        $province = $this->province();
        $regionName = '';
        foreach ($this->regions as $r) {
            if ($r['code'] === $province['region']) {
                $regionName = $r['name'];
                break;
            }
        }
        return trim("{$this->street()}, {$province['name']}, {$regionName}", ' ,');
    }
}
