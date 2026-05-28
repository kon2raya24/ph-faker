# Changelog

All notable changes to this project will be documented in this file. The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.3.0] - 2026-05-28

### Added

- **Four new government-ID generators**, matching the `@ph-dev-utils/core` v0.4 validators so output is format-valid:
  - `faker.id.nationalID()` — PhilSys National ID (16-digit PhilSys Card Number), `XXXX-XXXX-XXXX-XXXX`
  - `faker.id.umid()` — UMID Common Reference Number (12 digits), `XXXX-XXXXXXX-X`
  - `faker.id.passport()` — Philippine ePassport, `letter + 7 digits + letter` (e.g. `P1234567A`)
  - `faker.id.prc()` — PRC professional license / registration number (7 digits)
- PHP parity: `$faker->id->nationalID() / umid() / passport() / prc()`.

### Notes

- Same deterministic-RNG behavior as the existing ID generators. Generated IDs are **format-valid only** (no real registry behind them) — for test fixtures/seeders, never real-world use.

## [0.2.0] - 2026-05-21

### Added

- **`faker.payslip(opts?)`** — generates a complete fake PH payslip with employee identity (name, TIN, SSS, PhilHealth, Pag-IBIG, address) AND a real deduction breakdown computed via `@ph-dev-utils/payroll` (`netTakeHome` with SSS/PhilHealth/Pag-IBIG mandatories and optional BIR WT). Defaults: random salary via `faker.money.salary()`, WT included. Override with `{ salary, includeWT, nonTaxableAllowances }`.
- **`faker.date.*`** — `holiday(opts?)`, `workingDay(opts?)`, `anyDay(opts?)`. Backed by `@ph-dev-utils/core` holiday data. `workingDay` excludes both weekends and any declared PH holiday.
- **`faker.address.city(opts?)`** — random city/municipality from the PSA Q4 2024 PSGC dataset (1,634 entries). Filter by `{ region, province, isCity, isCapital }`.
- **`faker.address.fullWithCity()`** — single-line address composed via PSGC: `street, city, province, region`. Province segment is omitted for HUC entries with no province (e.g., City of Manila).
- New runtime dependencies: `@ph-dev-utils/core: ^0.2.0` (for cities + holidays) and `@ph-dev-utils/payroll: ^0.3.0` (for payslip math).
- 13 new vitest + 13 new PHPUnit tests (totals: 34 + 35 = 69 green).

### Notes

- `faker.address.full()` (v0.1 shape — `street, province, region`) is unchanged. Use `fullWithCity()` for the v0.2 4-segment version.
- All v0.2 generators flow through the same seeded PRNG, so determinism is preserved.

## [0.1.3] - 2026-05-19

### Added

- Full API Reference section in both per-package READMEs (`packages/js/README.md` and `packages/php/README.md`). Every method documented with signature, parameters, return type, and examples. Replaces the previous catch-all "Usage" code block.

### Changed

- No functional changes — documentation only.

## [0.1.2] - 2026-05-19

### Changed

- README badges (npm version, Packagist version, MIT license, Made in PH) on root and per-package READMEs.
- No functional changes — pure polish for discoverability on registry pages.

## [0.1.1] - 2026-05-19

### Fixed

- **Critical npm install fix.** v0.1.0 published with `dist/*.js` importing `../../../data/*.json` (a monorepo-relative path that doesn't ship in the tarball). Real installs broke at runtime with `ERR_MODULE_NOT_FOUND`. Data files are now bundled under `data/` inside the package, and imports rewired to `../data/`. PHP side was never affected (uses runtime `DataLoader` + split-mirror data bundle).

v0.1.0 deprecated on npm — please upgrade to 0.1.1+.

## [0.1.0] - 2026-05-19

Initial release. Filipino-localized fake-data generator for JS and PHP, sibling of [ph-dev-utils](https://github.com/kon2raya24/ph-dev-utils).

### Added

- `@ph-dev-utils/faker` (npm) and `phdevutils/faker` (Composer) packages.
- Seeded deterministic PRNG with per-instance isolation: mulberry32 in JS, `\Random\Engine\Mt19937` via `\Random\Randomizer` in PHP.
- `name` module — first / last / full / fullWithMiddle (PH middle-name = mother's maiden convention).
- `address` module — region / province / street / full, driven by the same `regions.json` + `provinces.json` data as ph-dev-utils.
- `phone` module — mobile (random network or by-network), landline by area code. Round-trips through ph-dev-utils' `parseMobile` / `parseLandline`.
- `id` module — format-valid TIN (9/12 digits), SSS (10), PhilHealth (12), Pag-IBIG (12). No reverse-engineered checksums.
- `money` module — peso amounts with centavos, `salary()` and `price()` helpers with realistic PH ranges.
- `business` module — sari-sari / carinderia / "Aling X" style composed names from generic word lists.

### Verification

- JS: 21 vitest tests pass.
- PHP: 22 phpunit tests pass (10,112 assertions).
- Cross-process determinism verified for both languages.
- Distribution sanity over 5000 samples: full coverage of curated name and mobile-prefix pools.

### Notes

- PHP minimum version is 8.2 (PHP 8.1 reached end-of-life on 2025-12-31).
- Cross-language seed compatibility is **not** guaranteed; same seed produces different sequences in JS vs PHP.
- Generated government IDs are format-valid only — see README for caveats about real-world use.

[Unreleased]: https://github.com/kon2raya24/ph-faker/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/kon2raya24/ph-faker/releases/tag/v0.1.0
