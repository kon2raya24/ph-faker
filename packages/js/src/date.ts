import { listHolidaysOfYear, isHoliday, listHolidayYears } from '@ph-dev-utils/core';
import type { Holiday } from '@ph-dev-utils/core';
import { Rng } from './rng.js';

export interface WorkingDayOptions {
  /** Year to sample from. Defaults to the most recent year in the bundled holiday data. */
  year?: number;
}

function defaultYear(): number {
  const years = listHolidayYears();
  return years[years.length - 1];
}

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isWeekend(iso: string): boolean {
  const d = new Date(`${iso}T00:00:00`);
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export class DateFaker {
  constructor(private rng: Rng) {}

  /**
   * Random declared PH holiday from the given year's dataset.
   *
   * Defaults to the most recent year bundled in @ph-dev-utils/core. Throws if the
   * year has no bundled data (per core's `listHolidaysOfYear`).
   *
   * @example
   *   faker.date.holiday();        // any 2026 holiday
   *   faker.date.holiday({ year: 2025 });
   */
  holiday(opts: WorkingDayOptions = {}): Holiday {
    const year = opts.year ?? defaultYear();
    const holidays = listHolidaysOfYear(year);
    return this.rng.pick(holidays);
  }

  /**
   * Random working day in the given year — not a weekend, not any kind of declared holiday
   * (regular, special non-working, or special working — though "special working" is technically
   * a workday, we exclude it because faked work-event dates usually want "ordinary" days).
   *
   * Returns an ISO date string `YYYY-MM-DD`.
   *
   * @example
   *   faker.date.workingDay();                       // 2026 working day
   *   faker.date.workingDay({ year: 2025 });
   */
  workingDay(opts: WorkingDayOptions = {}): string {
    const year = opts.year ?? defaultYear();
    // Rejection sampling — usually <5 attempts. Cap at 365 for safety.
    for (let i = 0; i < 365; i++) {
      const month = this.rng.nextInt(1, 12);
      const day = this.rng.nextInt(1, daysInMonth(year, month));
      const iso = isoDate(year, month, day);
      if (isWeekend(iso)) continue;
      if (isHoliday(iso)) continue;
      return iso;
    }
    // Defensive fallback: extremely unlikely.
    return isoDate(year, 6, 15);
  }

  /**
   * Random ISO date in the given year, with no holiday/weekend filtering.
   *
   * @example
   *   faker.date.anyDay({ year: 2026 });   // any 2026 calendar date
   */
  anyDay(opts: WorkingDayOptions = {}): string {
    const year = opts.year ?? defaultYear();
    const month = this.rng.nextInt(1, 12);
    const day = this.rng.nextInt(1, daysInMonth(year, month));
    return isoDate(year, month, day);
  }
}
