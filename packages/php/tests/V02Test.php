<?php

declare(strict_types=1);

namespace PhDevUtils\Faker\Tests;

use PhDevUtils\Faker\Faker;
use PHPUnit\Framework\TestCase;

final class V02Test extends TestCase
{
    public function testCityReturnsPSGCEntry(): void
    {
        $f = new Faker(42);
        $c = $f->address->city();
        $this->assertMatchesRegularExpression('/^\d{6}$/', $c['code']);
        $this->assertContains($c['region'], ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17']);
    }

    public function testCityFilterRegion(): void
    {
        $f = new Faker(42);
        for ($i = 0; $i < 5; $i++) {
            $this->assertSame('13', $f->address->city(['region' => '13'])['region']);
        }
    }

    public function testCityFilterIsCity(): void
    {
        $f = new Faker(42);
        for ($i = 0; $i < 5; $i++) {
            $this->assertTrue($f->address->city(['isCity' => true])['isCity']);
        }
    }

    public function testCityThrowsOnEmptyFilter(): void
    {
        $f = new Faker(42);
        $this->expectException(\OutOfRangeException::class);
        $f->address->city(['region' => '99']);
    }

    public function testFullWithCityShape(): void
    {
        $f = new Faker(42);
        $addr = $f->address->fullWithCity();
        $segments = array_map('trim', explode(',', $addr));
        $this->assertGreaterThanOrEqual(3, count($segments));
        $this->assertLessThanOrEqual(4, count($segments));
    }

    public function testDateHolidayDefault(): void
    {
        $f = new Faker(42);
        $h = $f->date->holiday();
        $this->assertMatchesRegularExpression('/^2026-\d{2}-\d{2}$/', $h['date']);
        $this->assertContains($h['type'], ['regular', 'special_non_working', 'special_working']);
    }

    public function testDateHolidaySpecificYear(): void
    {
        $f = new Faker(42);
        $this->assertStringStartsWith('2025-', $f->date->holiday(['year' => 2025])['date']);
    }

    public function testDateWorkingDayExcludesWeekendsAndHolidays(): void
    {
        $f = new Faker(42);
        for ($i = 0; $i < 20; $i++) {
            $iso = $f->date->workingDay();
            $this->assertMatchesRegularExpression('/^2026-\d{2}-\d{2}$/', $iso);
            $dow = (int) date('w', strtotime($iso));
            $this->assertNotContains($dow, [0, 6]);
        }
    }

    public function testDateAnyDay(): void
    {
        $f = new Faker(42);
        $this->assertMatchesRegularExpression('/^2025-\d{2}-\d{2}$/', $f->date->anyDay(['year' => 2025]));
    }

    public function testPayslipComplete(): void
    {
        $f = new Faker(42);
        $p = $f->payslip();
        $this->assertGreaterThan(0, strlen($p['employee']['fullName']));
        $this->assertMatchesRegularExpression('/^\d{3}-\d{3}-\d{3}-\d{3}$/', $p['employee']['tin']);
        $this->assertSame('monthly', $p['period']['type']);
        $this->assertGreaterThan(0, $p['computation']['gross']);
        $this->assertGreaterThan(0, $p['computation']['totalDeductions']);
        $this->assertLessThan($p['computation']['gross'], $p['computation']['net']);
    }

    public function testPayslipCustomSalary(): void
    {
        $f = new Faker(42);
        $p = $f->payslip(['salary' => 30000]);
        $this->assertSame(30000.0, $p['computation']['gross']);
        $this->assertSame(26542.45, $p['computation']['netAfterTax']);
    }

    public function testPayslipIncludeWTFalse(): void
    {
        $f = new Faker(42);
        $p = $f->payslip(['salary' => 30000, 'includeWT' => false]);
        $this->assertArrayNotHasKey('withholdingTax', $p['computation']);
        $this->assertArrayNotHasKey('netAfterTax', $p['computation']);
        $this->assertSame(27550.0, $p['computation']['net']);
    }

    public function testPayslipDeterminism(): void
    {
        $a = (new Faker(42))->payslip();
        $b = (new Faker(42))->payslip();
        $this->assertSame($a['employee']['fullName'], $b['employee']['fullName']);
        $this->assertSame($a['computation']['gross'], $b['computation']['gross']);
    }
}
