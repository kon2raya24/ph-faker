# @ph-dev-utils/faker

[![npm version](https://img.shields.io/npm/v/@ph-dev-utils/faker?label=npm&color=cb3837&logo=npm)](https://www.npmjs.com/package/@ph-dev-utils/faker)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/kon2raya24/ph-faker/blob/main/LICENSE)
[![Made in PH](https://img.shields.io/badge/made%20in-🇵🇭%20Philippines-0038A8)](https://github.com/kon2raya24)

Filipino-localized fake-data generator for JavaScript and TypeScript. Sibling of [`@ph-dev-utils/core`](https://www.npmjs.com/package/@ph-dev-utils/core).

Generates fake Filipino names, addresses, phone numbers, government IDs (format-valid only), peso amounts, and business names — driven by a seeded deterministic PRNG so your fixtures stay reproducible.

## Install

```bash
npm i -D @ph-dev-utils/faker
```

## Usage

```ts
import { faker, Faker } from '@ph-dev-utils/faker';

// Use the default singleton:
faker.seed(42);
faker.name.full();              // 'Maria Santos'
faker.name.fullWithMiddle();    // 'Maria Reyes Santos' (mother's maiden = middle, PH convention)

// Or create your own instance with its own RNG (no global-state bleed):
const f = new Faker(2024);
f.address.region();             // { code: '04', name: 'CALABARZON', designation: 'Region IV-A' }
f.address.province();           // { code: '0434', name: 'Cavite', region: '04' }
f.address.full();               // '123 Rizal St., Cavite, CALABARZON'

f.phone.mobile();               // '+639171234567'
f.phone.mobileByNetwork('Globe');
f.phone.landline();             // '(02) 8123-4567'

f.id.tin();                     // '123-456-789-000'  (with branch)
f.id.tin(false);                // '123-456-789'      (individual, no branch)
f.id.sss();                     // '12-3456789-0'
f.id.philhealth();              // '12-345678901-2'
f.id.pagibig();                 // '1234-5678-9012'

f.money.peso({ min: 100, max: 1000 });
f.money.salary();               // realistic PH range (PHP 15,000 – 80,000)
f.money.price();                // sari-sari scale (5 – 500)

f.business.name();              // 'Aling Nena Sari-Sari Store'
```

## Determinism

`new Faker(seed)` and `faker.seed(n)` make subsequent calls deterministic *within the same Node version*. Cross-language seed compatibility with the PHP package is **not** guaranteed (JS uses mulberry32, PHP uses `\Random\Engine\Mt19937`).

Each `Faker` instance owns its own PRNG state, so multiple instances with different seeds run **independently** — no global-state bleed.

## ⚠️ Important warnings

- **Government IDs** are format-valid only. They follow the right shape (TIN: 9/12 digits, SSS: 10, PhilHealth/Pag-IBIG: 12) and may collide with real persons' IDs by chance. **Use for tests only.** Never submit faker output to BIR, SSS, PhilHealth, Pag-IBIG, or any production system.
- **Phone numbers** use real network prefixes (so they round-trip through `@ph-dev-utils/core`'s `parseMobile`) but random suffixes. **May collide with real numbers.** Use for tests only.
- **Names** are generic and curated from public sources. Any resemblance to specific real persons is coincidental.

## License

MIT
