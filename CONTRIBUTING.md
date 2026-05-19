# Contributing to ph-faker

Thanks for your interest. This package only stays useful if it generates believable Filipino data without crossing into "names of specific real people" or "wrong numbers passing as real."

## What we want PRs for

1. **More name list entries** — additional Filipino given names and surnames, *with a public-source citation*. PSA's most-common-surnames publications are ideal. Avoid celebrity names, names of living public figures, and rare/distinctive surnames that effectively identify a specific person.
2. **Tagalog / Bisaya / Ilocano flavor splits** — currently the name pool is general. PRs that add regional sub-pools (toggleable via an option) are welcome — propose the API in an issue first.
3. **Business / street word additions** — keep them generic (no real registered business names, no specific street names of identifiable real-world locations).
4. **Network prefix updates** — if Globe/Smart/Sun/DITO reassigns prefixes, sync `data/network-prefixes.json` with [ph-dev-utils](https://github.com/kon2raya24/ph-dev-utils) (it's the upstream source — PR there first).
5. **Bug fixes** with a failing test that demonstrates the bug.

## What we will not merge

- **Names of living public figures, celebrities, or major political dynasties.** This package is for test fixtures; outputs that read as references to specific real people are off-mission.
- **Government ID generators with reverse-engineered checksums.** PhilHealth/SSS/Pag-IBIG don't publish official check digits; unofficial implementations produce confident-but-wrong values that could cause real harm if misused. Format-valid only.
- **Anything that depends on `@ph-dev-utils/core` or `phdevutils/core` at runtime.** Those packages are siblings, not parents — keep `ph-faker` installable on its own. Dev-only cross-package checks are OK.
- **Data file changes without a citation.** If you're adding entries to `data/*.json`, link to the public source in the PR description.

## Running tests locally

**Prerequisites:** Node 20+, PHP 8.2+, Composer.

### JS package

```bash
cd packages/js
npm install
npm test          # vitest
npm run build     # tsc → dist/
```

### PHP package

```bash
cd packages/php
composer install
vendor/bin/phpunit
```

## API parity

The JS and PHP APIs deliberately mirror each other:

| Capability | JS | PHP |
| --- | --- | --- |
| Construct | `new Faker(seed)` | `new Faker(seed: $seed)` |
| Reseed | `faker.seed(n)` | `$f->seed($n)` |
| Random name | `faker.name.full()` | `$f->name->full()` |
| Random address | `faker.address.full()` | `$f->address->full()` |
| Random mobile | `faker.phone.mobile()` | `$f->phone->mobile()` |
| Random TIN | `faker.id.tin()` | `$f->id->tin()` |

If you add a function to one side, please add the equivalent to the other (or open an issue if you only know one language — we'll pair).

## Determinism contract

Same seed → same sequence, *within the same language and runtime version*. Cross-language seed compatibility is not promised, and is unlikely to ever be — JS uses mulberry32, PHP uses `\Random\Engine\Mt19937`, and aligning them across overflow semantics isn't worth the complexity.

Multiple `Faker` instances must remain independent. PRs that introduce shared global state (e.g. `mt_srand`, `Math.random`-based defaults) will be rejected — see `Rng.php` and `rng.ts` for the per-instance pattern.

## Publishing (PHP package)

Packagist requires `composer.json` at repo root, but this is a monorepo. To publish, we maintain a read-only mirror at https://github.com/kon2raya24/ph-faker-php that contains only the PHP package (with `data/` bundled in).

Update the mirror from a clean monorepo working tree:

```bash
bash scripts/split-php.sh
```

The script uses `git subtree split` to extract `packages/php/` history, copies `data/*.json` into the split root, and force-pushes to the mirror's `main` branch. Force-push is expected — `git subtree split` recomputes commit hashes each run.

To cut a release:

1. Bump `version` in `packages/php/composer.json` (when/if added) and `CHANGELOG.md`.
2. Commit and push the monorepo.
3. Run `scripts/split-php.sh` to update the mirror.
4. Tag the mirror: in the mirror repo, `git tag vX.Y.Z && git push origin vX.Y.Z` (or use the GitHub UI on the mirror).
5. (First time only) submit the mirror URL at https://packagist.org/packages/submit. After that, Packagist auto-syncs.

The JS package publishes directly to npm from the monorepo — no split needed:

```bash
cd packages/js && npm publish --access public
```

## Commit conventions

No strict format, but:
- Keep the subject under 70 chars.
- Explain *why* in the body when behavior changes.
- Link to the public source when adding data entries.

## License

By contributing, you agree your contribution is licensed under MIT.
