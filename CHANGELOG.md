# Changelog

All notable changes to this project will be documented in this file. The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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
