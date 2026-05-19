<?php

declare(strict_types=1);

namespace PhDevUtils\Faker\Tests;

use PhDevUtils\Faker\Faker;
use PHPUnit\Framework\TestCase;

final class ModulesTest extends TestCase
{
    public function testNameFirstReturnsNonEmpty(): void
    {
        $f = new Faker(7);
        $this->assertNotEmpty($f->name->first('male'));
        $this->assertNotEmpty($f->name->first('female'));
        $this->assertNotEmpty($f->name->first());
    }

    public function testFullWithMiddleHasThreeParts(): void
    {
        $f = new Faker(7);
        $parts = explode(' ', $f->name->fullWithMiddle());
        $this->assertGreaterThanOrEqual(3, count($parts));
    }

    public function testRegionShape(): void
    {
        $f = new Faker(7);
        $r = $f->address->region();
        $this->assertArrayHasKey('code', $r);
        $this->assertArrayHasKey('name', $r);
        $this->assertArrayHasKey('designation', $r);
    }

    public function testProvinceShape(): void
    {
        $f = new Faker(7);
        $p = $f->address->province();
        $this->assertMatchesRegularExpression('/^\d{2}$/', $p['region']);
    }

    public function testMoneyPesoRange(): void
    {
        $f = new Faker(7);
        for ($i = 0; $i < 100; $i++) {
            $v = $f->money->peso(100, 200);
            $this->assertGreaterThanOrEqual(100, $v);
            $this->assertLessThanOrEqual(200.99, $v);
        }
    }

    public function testMoneySalaryRange(): void
    {
        $f = new Faker(7);
        for ($i = 0; $i < 100; $i++) {
            $v = $f->money->salary();
            $this->assertGreaterThanOrEqual(15000, $v);
            $this->assertLessThanOrEqual(80000.99, $v);
        }
    }

    public function testBusinessName(): void
    {
        $f = new Faker(7);
        for ($i = 0; $i < 50; $i++) {
            $this->assertNotEmpty($f->business->name());
        }
    }
}
