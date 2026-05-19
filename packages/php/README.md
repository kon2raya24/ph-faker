# phdevutils/faker

Filipino-localized fake-data generator for PHP. Sibling of [`phdevutils/core`](https://packagist.org/packages/phdevutils/core).

Generates fake Filipino names, addresses, phone numbers, government IDs (format-valid only), peso amounts, and business names — driven by a seeded deterministic PRNG so your fixtures stay reproducible.

## Install

```bash
composer require --dev phdevutils/faker
```

Requires PHP 8.2+ (uses `\Random\Engine\Mt19937` for per-instance PRNG isolation).

## Usage

```php
use PhDevUtils\Faker\Faker;

$f = new Faker(seed: 42);

$f->name->first();              // 'Maria'
$f->name->last();               // 'Santos'
$f->name->full();               // 'Maria Santos'
$f->name->fullWithMiddle();     // 'Maria Reyes Santos' (mother's maiden = middle, PH convention)

$f->address->region();          // ['code' => '04', 'name' => 'CALABARZON', 'designation' => 'Region IV-A']
$f->address->province();        // ['code' => '0434', 'name' => 'Cavite', 'region' => '04']
$f->address->full();            // '123 Rizal St., Cavite, CALABARZON'

$f->phone->mobile();            // '+639171234567'
$f->phone->mobileByNetwork('Globe');
$f->phone->landline();          // '(02) 8123-4567'

$f->id->tin();                  // '123-456-789-000'  (with branch)
$f->id->tin(false);             // '123-456-789'      (individual, no branch)
$f->id->sss();                  // '12-3456789-0'
$f->id->philhealth();           // '12-345678901-2'
$f->id->pagibig();              // '1234-5678-9012'

$f->money->peso(100, 1000);
$f->money->salary();            // realistic PH range (PHP 15,000 – 80,000)
$f->money->price();             // sari-sari scale (5 – 500)

$f->business->name();           // 'Aling Nena Sari-Sari Store'
```

## Determinism

`new Faker($seed)` and `$f->seed($n)` make subsequent calls deterministic *within the same PHP runtime*. Cross-language seed compatibility with the JS package is **not** guaranteed (JS uses mulberry32, PHP uses `\Random\Engine\Mt19937`).

Each `Faker` instance owns its own PRNG engine, so multiple instances with different seeds run **independently** — no global-state bleed (the package does not touch `mt_srand`).

## ⚠️ Important warnings

- **Government IDs** are format-valid only. They follow the right shape (TIN: 9/12 digits, SSS: 10, PhilHealth/Pag-IBIG: 12) and may collide with real persons' IDs by chance. **Use for tests only.** Never submit faker output to BIR, SSS, PhilHealth, Pag-IBIG, or any production system.
- **Phone numbers** use real network prefixes (so they round-trip through `phdevutils/core`'s `Phone::parseMobile`) but random suffixes. **May collide with real numbers.** Use for tests only.
- **Names** are generic and curated from public sources. Any resemblance to specific real persons is coincidental.

## License

MIT
