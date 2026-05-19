# ph-faker

[![npm version](https://img.shields.io/npm/v/@ph-dev-utils/faker?label=npm&color=cb3837&logo=npm)](https://www.npmjs.com/package/@ph-dev-utils/faker)
[![Packagist version](https://img.shields.io/packagist/v/phdevutils/faker?label=Packagist&color=f28d1a&logo=packagist&logoColor=white)](https://packagist.org/packages/phdevutils/faker)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Made in PH](https://img.shields.io/badge/made%20in-🇵🇭%20Philippines-0038A8)](https://github.com/kon2raya24)

Filipino-localized fake-data generator for JS and PHP. Sibling of [ph-dev-utils](https://github.com/kon2raya24/ph-dev-utils).

Generates fake Filipino names, addresses, phone numbers, government IDs (format-valid only), peso amounts, and business names — all driven by a seeded deterministic PRNG so your test fixtures stay reproducible.

## Packages

| Language | Package | Install |
|----------|---------|---------|
| JavaScript / TypeScript | `@ph-dev-utils/faker` | `npm i -D @ph-dev-utils/faker` |
| PHP | `phdevutils/faker` | `composer require --dev phdevutils/faker` |

## JS usage

```ts
import { faker } from '@ph-dev-utils/faker';

faker.seed(42);
faker.name.first();              // 'Maria'
faker.name.last();               // 'Santos'
faker.name.full();               // 'Maria Santos'
faker.name.fullWithMiddle();     // 'Maria Reyes Santos' (mother's maiden = middle)

faker.address.region();          // { code: '04', name: 'CALABARZON', designation: 'Region IV-A' }
faker.address.province();        // { code: '0434', name: 'Cavite', region: '04' }
faker.address.full();            // '123 Rizal St., Cavite, CALABARZON'

faker.phone.mobile();            // '+639171234567'
faker.phone.mobileByNetwork('Globe');
faker.phone.landline();          // '(02) 8123-4567'

faker.id.tin();                  // '123-456-789-000'
faker.id.sss();                  // '12-3456789-0'
faker.id.philhealth();           // '12-345678901-2'
faker.id.pagibig();              // '1234-5678-9012'

faker.money.peso();              // 12345.67
faker.money.salary();            // realistic PH salary range

faker.business.name();           // 'Aling Nena Sari-Sari Store'
```

## PHP usage

```php
use PhDevUtils\Faker\Faker;

$f = new Faker(seed: 42);
$f->name->first();
$f->address->province();
$f->phone->mobile();
$f->id->tin();
$f->money->peso();
$f->business->name();
```

## ⚠️ Important warnings

- **Government IDs** are format-valid only. They follow the right shape (TIN: 9/12 digits, SSS: 10, PhilHealth/Pag-IBIG: 12) and may **collide with real persons' IDs by chance**. **Use for tests only.** Never submit faker output to BIR, SSS, PhilHealth, Pag-IBIG, or any production system.
- **Phone numbers** use real network prefixes (so they round-trip through `ph-dev-utils`' `parseMobile`) but random suffixes. **May collide with real numbers.** Use for tests only.
- **Names** are generic and curated from public sources. Any resemblance to specific real persons is coincidental.

## Determinism

Calling `faker.seed(n)` makes subsequent calls deterministic *within the same language*. Cross-language seed compatibility is **not** guaranteed in v0.1 (JS uses mulberry32, PHP uses Mt19937 via `\Random\Randomizer`).

Each `Faker` instance owns its own PRNG state, so multiple instances with different seeds run independently — there is no global-state bleed.

## License

MIT
