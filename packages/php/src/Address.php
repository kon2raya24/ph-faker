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

    /**
     * Random city/municipality from the PSA Q4 2024 PSGC dataset.
     *
     * @param array{region?: string, province?: ?string, isCity?: bool} $filter
     * @return array{code: string, name: string, province: ?string, region: string, isCity: bool, isCapital: bool}
     */
    public function city(array $filter = []): array
    {
        $pool = \PhDevUtils\Address::listCitiesMunicipalities($filter);
        if (empty($pool)) {
            throw new \OutOfRangeException('Address::city: no entries match the given filter');
        }
        return $this->rng->pick($pool);
    }

    /**
     * Full single-line address composed via the PSGC city dataset:
     * `street, city, province, region`. Province omitted for HUC entries with no province.
     */
    public function fullWithCity(): string
    {
        $city = $this->city();
        $regionName = '';
        foreach ($this->regions as $r) {
            if ($r['code'] === $city['region']) {
                $regionName = $r['name'];
                break;
            }
        }
        $provinceName = null;
        if ($city['province'] !== null) {
            foreach ($this->provinces as $p) {
                if ($p['code'] === $city['province']) {
                    $provinceName = $p['name'];
                    break;
                }
            }
        }
        $parts = [$this->street(), $city['name']];
        if ($provinceName !== null) $parts[] = $provinceName;
        if ($regionName !== '') $parts[] = $regionName;
        return implode(', ', $parts);
    }
}
