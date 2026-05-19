<?php

declare(strict_types=1);

namespace PhDevUtils\Faker;

final class Business
{
    /** @var array<string, array<int, string>> */
    private array $businessWords;
    /** @var array<int, string> */
    private array $maleFirst;
    /** @var array<int, string> */
    private array $femaleFirst;
    /** @var array<int, string> */
    private array $lastNames;

    public function __construct(private Rng $rng)
    {
        $this->businessWords = DataLoader::load('business-words');
        $this->maleFirst = DataLoader::load('first-names-male');
        $this->femaleFirst = DataLoader::load('first-names-female');
        $this->lastNames = DataLoader::load('last-names');
    }

    public function name(): string
    {
        $pattern = $this->rng->nextInt(1, 3);

        if ($pattern === 1) {
            $honorific = $this->rng->pick($this->businessWords['honorifics']);
            $isFemale = in_array($honorific, ['Aling', 'Nanay', 'Lola', 'Ate'], true);
            $pool = $isFemale ? $this->femaleFirst : $this->maleFirst;
            $given = $this->rng->pick($pool);
            $suffix = $this->rng->pick($this->businessWords['suffixes']);
            return "{$honorific} {$given} {$suffix}";
        }

        if ($pattern === 2) {
            $initials = $this->rng->pick($this->businessWords['initials_words']);
            $suffix = $this->rng->pick($this->businessWords['suffixes']);
            return "{$initials} {$suffix}";
        }

        $phrase = $this->rng->pick($this->businessWords['place_flavored']);
        if ($phrase === 'Tindahan ni') {
            return "{$phrase} " . $this->rng->pick($this->lastNames);
        }
        $suffix = $this->rng->pick($this->businessWords['suffixes']);
        return "{$phrase} {$suffix}";
    }
}
