<?php

declare(strict_types=1);

namespace PhDevUtils\Faker;

use PhDevUtils\Holidays;

final class DateFaker
{
    public function __construct(private Rng $rng) {}

    /**
     * Random declared PH holiday from the given year.
     *
     * @param array{year?: int} $opts
     * @return array{date: string, name: string, type: string, proclamation?: string}
     */
    public function holiday(array $opts = []): array
    {
        $year = $opts['year'] ?? self::defaultYear();
        $holidays = Holidays::listHolidaysOfYear($year);
        return $this->rng->pick($holidays);
    }

    /**
     * Random working day (not weekend, not declared holiday) in the given year.
     *
     * @param array{year?: int} $opts
     */
    public function workingDay(array $opts = []): string
    {
        $year = $opts['year'] ?? self::defaultYear();
        for ($i = 0; $i < 365; $i++) {
            $month = $this->rng->nextInt(1, 12);
            $day = $this->rng->nextInt(1, (int) date('t', mktime(0, 0, 0, $month, 1, $year)));
            $iso = sprintf('%04d-%02d-%02d', $year, $month, $day);
            $dow = (int) date('w', strtotime($iso));
            if ($dow === 0 || $dow === 6) continue; // sun/sat
            if (Holidays::isHoliday($iso)) continue;
            return $iso;
        }
        return sprintf('%04d-06-15', $year);
    }

    /**
     * Random ISO date in the given year (no filtering).
     *
     * @param array{year?: int} $opts
     */
    public function anyDay(array $opts = []): string
    {
        $year = $opts['year'] ?? self::defaultYear();
        $month = $this->rng->nextInt(1, 12);
        $day = $this->rng->nextInt(1, (int) date('t', mktime(0, 0, 0, $month, 1, $year)));
        return sprintf('%04d-%02d-%02d', $year, $month, $day);
    }

    private static function defaultYear(): int
    {
        $years = Holidays::listHolidayYears();
        return $years[count($years) - 1];
    }
}
