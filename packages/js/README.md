# @ph-dev-utils/faker

[![npm version](https://img.shields.io/npm/v/@ph-dev-utils/faker?label=npm&color=cb3837&logo=npm)](https://www.npmjs.com/package/@ph-dev-utils/faker)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/kon2raya24/ph-faker/blob/main/LICENSE)
[![Made in PH](https://img.shields.io/badge/made%20in-🇵🇭%20Philippines-0038A8)](https://github.com/kon2raya24)

Filipino-localized fake-data generator for JavaScript / TypeScript — Filipino names, addresses (PSGC regions + provinces), phone numbers with network detection, format-valid government IDs, peso amounts, and PH-flavored business names. Driven by a seeded deterministic PRNG so your test fixtures are reproducible.

Sibling of [`@ph-dev-utils/core`](https://www.npmjs.com/package/@ph-dev-utils/core) (the validators).

## Install

```bash
npm install --save-dev @ph-dev-utils/faker
```

Requires Node 20+.

## Quick start

```ts
import { faker, Faker } from '@ph-dev-utils/faker';

// Use the default singleton:
faker.seed(42);
faker.name.full();              // 'Maria Santos'
faker.address.full();           // '123 Rizal St., Cavite, CALABARZON'
faker.phone.mobile();           // '+639171234567'
faker.id.tin();                 // '123-456-789-000'

// Or create your own instance with its own RNG state (no global-state bleed):
const f = new Faker(2024);
f.business.name();              // 'Aling Nena Sari-Sari Store'
```

## API Reference

### `Faker` class

#### `new Faker(seed?: number)`

Creates a new Faker instance with optional integer seed. Default seed is `0xC0DEFEED`. Each instance owns its own PRNG state — two instances with different seeds never interfere with each other.

```ts
const f1 = new Faker();         // default seed
const f2 = new Faker(42);       // custom seed → reproducible
```

#### `f.seed(value: number): void`

Resets the PRNG to start a fresh sequence from `value`. Useful between test runs.

```ts
const f = new Faker(1);
f.name.full();   // 'Cristina Cruz'
f.seed(1);
f.name.full();   // 'Cristina Cruz' (same — sequence reset)
```

#### `faker` singleton

A pre-constructed `Faker` exported as a convenience. Equivalent to `new Faker()`.

```ts
import { faker } from '@ph-dev-utils/faker';
faker.seed(42);
faker.name.full();
```

---

### `f.name` — Filipino names

#### `f.name.first(gender?: 'male' | 'female'): string`

Returns a Filipino given name. If `gender` is omitted, picks randomly (50/50).

```ts
f.name.first();           // 'Maria'
f.name.first('male');     // 'Juan'
f.name.first('female');   // 'Liza'
```

#### `f.name.last(): string`

Returns a Filipino surname (Spanish-origin, native, or Chinese-Filipino patterns). Politically-loaded surnames (heads of state, major political dynasties) are deliberately excluded.

```ts
f.name.last();   // 'Reyes'
```

#### `f.name.full(gender?: 'male' | 'female'): string`

Returns `${first} ${last}`.

```ts
f.name.full();           // 'Maria Santos'
f.name.full('male');     // 'Carlos Mendoza'
```

#### `f.name.fullWithMiddle(gender?: 'male' | 'female'): string`

Returns `${first} ${motherMaiden} ${last}` — Filipino convention where the middle name is the mother's maiden surname.

```ts
f.name.fullWithMiddle();   // 'Maria Reyes Santos'
```

---

### `f.address` — PSGC-backed addresses

#### `f.address.region(): Region`

Returns one of the 17 PH regions. Shape: `{ code: string, name: string, designation: string }`.

```ts
f.address.region();
// { code: '04', name: 'CALABARZON', designation: 'Region IV-A' }
```

#### `f.address.province(): Province`

Returns one of ~80 PH provinces. Shape: `{ code: string, name: string, region: string }` — `region` is the parent region code.

```ts
f.address.province();
// { code: '0434', name: 'Cavite', region: '04' }
```

#### `f.address.street(): string`

Returns a single-line street like `'{number} {name} {type}'`. Names are drawn from heroes / flowers / trees pools. Types include `St.`, `Avenue`, `Road`, `Drive`, etc.

```ts
f.address.street();   // '8090 Burgos Avenue'
```

#### `f.address.full(): string`

Composed full address: `'{street}, {province}, {region}'`.

```ts
f.address.full();
// '8090 Burgos Avenue, La Union, Ilocos Region'
```

---

### `f.phone` — PH mobile and landline

#### `f.phone.mobile(): string`

Returns a random PH mobile number in E.164 format (`+63XXXXXXXXXX`). Network is chosen randomly across Globe / Smart / Sun / DITO. The prefix is real — feeding the output back into `@ph-dev-utils/core`'s `parseMobile` returns the same network.

```ts
f.phone.mobile();   // '+639171234567'
```

#### `f.phone.mobileByNetwork(network: 'Globe' | 'Smart' | 'Sun' | 'DITO'): string`

Returns a mobile number with a prefix belonging to the given network.

```ts
f.phone.mobileByNetwork('Globe');   // '+639170123456'
f.phone.mobileByNetwork('DITO');    // '+639950987654'
```

Throws `Error` if `network` isn't one of the four valid networks.

#### `f.phone.landline(): string`

Returns a PH landline number with a real area code (Metro Manila, Cebu, Davao, etc.). Metro Manila numbers use 8-digit subscribers; other areas use 7-digit.

```ts
f.phone.landline();   // '(02) 8123-4567'
f.phone.landline();   // '(32) 234-5678'
```

---

### `f.id` — government IDs (format-valid only)

> ⚠️ All generated IDs are **format-valid only**. They follow the right digit count and shape but may collide with real persons' IDs by chance. **Use for tests only.** Never submit faker output to BIR, SSS, PhilHealth, Pag-IBIG, or any production system.

#### `f.id.tin(withBranch?: boolean): string`

Returns a BIR TIN. With `withBranch: true` (default) returns 12 digits `XXX-XXX-XXX-XXX`; with `false` returns 9 digits `XXX-XXX-XXX`.

```ts
f.id.tin();        // '123-456-789-000'
f.id.tin(true);    // '123-456-789-456' (with branch)
f.id.tin(false);   // '123-456-789'     (individual, no branch)
```

#### `f.id.sss(): string`

Returns a 10-digit SSS number formatted `XX-XXXXXXX-X`.

```ts
f.id.sss();   // '12-3456789-0'
```

#### `f.id.philhealth(): string`

Returns a 12-digit PhilHealth ID formatted `XX-XXXXXXXXX-X`.

```ts
f.id.philhealth();   // '12-345678901-2'
```

#### `f.id.pagibig(): string`

Returns a 12-digit Pag-IBIG MID formatted `XXXX-XXXX-XXXX`.

```ts
f.id.pagibig();   // '1234-5678-9012'
```

---

### `f.money` — peso amounts

#### `f.money.peso(opts?: { min?: number, max?: number }): number`

Returns a random peso amount with centavos. Defaults: `min: 0, max: 10000`. Two-decimal precision.

```ts
f.money.peso();                            // 4218.73
f.money.peso({ min: 100, max: 500 });      // 387.21
```

#### `f.money.salary(): number`

Returns a realistic PH monthly salary (PHP 15,000 – 80,000). Shorthand for `peso({ min: 15000, max: 80000 })`.

```ts
f.money.salary();   // 42158.50
```

#### `f.money.price(): number`

Returns a sari-sari–scale price (PHP 5 – 500). Shorthand for `peso({ min: 5, max: 500 })`.

```ts
f.money.price();   // 87.25
```

---

### `f.business` — PH-flavored business names

#### `f.business.name(): string`

Returns a fake business name. Composes from three patterns picked randomly:

- `{honorific} {given name} {suffix}` — e.g. `Aling Nena Sari-Sari Store`, `Mang Pedro Carinderia`
- `{initials} {suffix}` — e.g. `RJ Trading`, `MNL Foods`
- `{phrase} {suffix or last name}` — e.g. `Doon Sa Kanto Cafe`, `Tindahan ni Reyes`

```ts
f.business.name();   // 'Aling Nena Sari-Sari Store'
f.business.name();   // 'RJ Enterprises'
f.business.name();   // 'Tindahan ni Reyes'
```

---

## Determinism

Calling `faker.seed(n)` (or `new Faker(n)`) makes subsequent calls deterministic *within the same Node version*. Same seed → same sequence.

Cross-language seed compatibility with the PHP package is **not** guaranteed — JS uses mulberry32, PHP uses `\Random\Engine\Mt19937`. The two produce different sequences from the same seed.

Each `Faker` instance owns its own PRNG state, so multiple instances with different seeds run independently — there is no shared global state.

## ⚠️ Important warnings

- **Government IDs** are format-valid only (see warning in the `f.id` section above).
- **Phone numbers** use real network prefixes (so they round-trip through `@ph-dev-utils/core`'s `parseMobile`) but the subscriber digits are random. They may collide with real numbers. Use for tests only.
- **Names** are curated from public sources. Any resemblance to specific real persons is coincidental. Celebrity names and major political-dynasty surnames are deliberately excluded.

## License

MIT
