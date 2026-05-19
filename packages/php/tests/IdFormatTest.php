<?php

declare(strict_types=1);

namespace PhDevUtils\Faker\Tests;

use PhDevUtils\Faker\Faker;
use PHPUnit\Framework\TestCase;

// Format spec mirrors phdevutils/core validators. Keep in sync if ph-dev-utils
// changes its TIN/SSS/PhilHealth/Pag-IBIG digit-length rules.
final class IdFormatTest extends TestCase
{
    private const SAMPLES = 1000;

    private function digits(string $s): string
    {
        return preg_replace('/\D/', '', $s);
    }

    public function testTinWithBranchIs12Digits(): void
    {
        $f = new Faker(123);
        for ($i = 0; $i < self::SAMPLES; $i++) {
            $this->assertSame(12, strlen($this->digits($f->id->tin())));
        }
    }

    public function testTinWithoutBranchIs9Digits(): void
    {
        $f = new Faker(123);
        for ($i = 0; $i < self::SAMPLES; $i++) {
            $this->assertSame(9, strlen($this->digits($f->id->tin(false))));
        }
    }

    public function testSssIs10DigitsAndFormatted(): void
    {
        $f = new Faker(123);
        for ($i = 0; $i < self::SAMPLES; $i++) {
            $id = $f->id->sss();
            $this->assertSame(10, strlen($this->digits($id)));
            $this->assertMatchesRegularExpression('/^\d{2}-\d{7}-\d$/', $id);
        }
    }

    public function testPhilHealthIs12DigitsAndFormatted(): void
    {
        $f = new Faker(123);
        for ($i = 0; $i < self::SAMPLES; $i++) {
            $id = $f->id->philhealth();
            $this->assertSame(12, strlen($this->digits($id)));
            $this->assertMatchesRegularExpression('/^\d{2}-\d{9}-\d$/', $id);
        }
    }

    public function testPagIbigIs12DigitsAndFormatted(): void
    {
        $f = new Faker(123);
        for ($i = 0; $i < self::SAMPLES; $i++) {
            $id = $f->id->pagibig();
            $this->assertSame(12, strlen($this->digits($id)));
            $this->assertMatchesRegularExpression('/^\d{4}-\d{4}-\d{4}$/', $id);
        }
    }
}
