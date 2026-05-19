<?php

declare(strict_types=1);

namespace PhDevUtils\Faker\Tests;

use PhDevUtils\Faker\Faker;
use PHPUnit\Framework\TestCase;

final class DeterminismTest extends TestCase
{
    public function testSameSeedProducesSameSequence(): void
    {
        $a = new Faker(42);
        $b = new Faker(42);
        for ($i = 0; $i < 50; $i++) {
            $this->assertSame($a->name->full(), $b->name->full());
        }
    }

    public function testSeedResetsSequence(): void
    {
        $f = new Faker(42);
        $first = [$f->name->full(), $f->id->tin(), $f->phone->mobile()];
        $f->seed(42);
        $second = [$f->name->full(), $f->id->tin(), $f->phone->mobile()];
        $this->assertSame($first, $second);
    }

    public function testDifferentSeedsDiverge(): void
    {
        $a = new Faker(1);
        $b = new Faker(2);
        $set = [];
        for ($i = 0; $i < 20; $i++) {
            $set[$a->name->full()] = true;
            $set[$b->name->full()] = true;
        }
        $this->assertGreaterThan(10, count($set));
    }

    public function testTwoInstancesDoNotShareState(): void
    {
        // Sequence from a Faker(7) used alone.
        $solo = new Faker(7);
        $soloSeq = [];
        for ($i = 0; $i < 10; $i++) {
            $soloSeq[] = $solo->name->full();
        }

        // Same Faker(7) used while another Faker(99) is also drawing.
        // If Mt19937 engine state leaked between instances, soloSeq2 would diverge.
        $a = new Faker(7);
        $b = new Faker(99);
        $soloSeq2 = [];
        for ($i = 0; $i < 10; $i++) {
            $soloSeq2[] = $a->name->full();
            $b->name->full(); // discard — must NOT influence $a
        }
        $this->assertSame($soloSeq, $soloSeq2);
    }
}
