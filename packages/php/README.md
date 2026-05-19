# phdevutils/faker

[![Packagist version](https://img.shields.io/packagist/v/phdevutils/faker?label=Packagist&color=f28d1a&logo=packagist&logoColor=white)](https://packagist.org/packages/phdevutils/faker)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/kon2raya24/ph-faker/blob/main/LICENSE)
[![Made in PH](https://img.shields.io/badge/made%20in-🇵🇭%20Philippines-0038A8)](https://github.com/kon2raya24)

Filipino-localized fake-data generator for PHP — Filipino names, addresses (PSGC regions + provinces), phone numbers with network detection, format-valid government IDs, peso amounts, and PH-flavored business names. Driven by a seeded deterministic PRNG so your test fixtures are reproducible.

Sibling of [`phdevutils/core`](https://packagist.org/packages/phdevutils/core) (the validators).

## Install

```bash
composer require --dev phdevutils/faker
```

Requires PHP 8.2+ (uses `\Random\Engine\Mt19937` for per-instance PRNG isolation).

## Quick start

```php
use PhDevUtils\Faker\Faker;

$f = new Faker(seed: 42);

$f->name->full();              // 'Maria Santos'
$f->address->full();           // '123 Rizal St., Cavite, CALABARZON'
$f->phone->mobile();           // '+639171234567'
$f->id->tin();                 // '123-456-789-000'
$f->business->name();          // 'Aling Nena Sari-Sari Store'
```

## API Reference

### `Faker` class

#### `new Faker(int $seed = 0x0DEFEED)`

Creates a new Faker instance with optional integer seed. Each instance owns its own `\Random\Randomizer` engine — two instances with different seeds never interfere.

```php
$f1 = new Faker();         // default seed
$f2 = new Faker(seed: 42); // custom seed → reproducible
```

#### `$f->seed(int $value): void`

Resets the PRNG to start a fresh sequence from `$value`.

```php
$f = new Faker(1);
$f->name->full();   // 'Cristina Cruz'
$f->seed(1);
$f->name->full();   // 'Cristina Cruz' (same — sequence reset)
```

---

### `$f->name` — Filipino names

#### `$f->name->first(?string $gender = null): string`

Returns a Filipino given name. If `$gender` is `null`, picks `'male'` / `'female'` randomly (50/50).

```php
$f->name->first();           // 'Maria'
$f->name->first('male');     // 'Juan'
$f->name->first('female');   // 'Liza'
```

#### `$f->name->last(): string`

Returns a Filipino surname (Spanish-origin, native, or Chinese-Filipino patterns). Politically-loaded surnames (heads of state, major political dynasties) are deliberately excluded.

```php
$f->name->last();   // 'Reyes'
```

#### `$f->name->full(?string $gender = null): string`

Returns `"{$first} {$last}"`.

```php
$f->name->full();           // 'Maria Santos'
$f->name->full('male');     // 'Carlos Mendoza'
```

#### `$f->name->fullWithMiddle(?string $gender = null): string`

Returns `"{$first} {$motherMaiden} {$last}"` — Filipino convention where the middle name is the mother's maiden surname.

```php
$f->name->fullWithMiddle();   // 'Maria Reyes Santos'
```

---

### `$f->address` — PSGC-backed addresses

#### `$f->address->region(): array`

Returns one of the 17 PH regions as an associative array: `['code' => string, 'name' => string, 'designation' => string]`.

```php
$f->address->region();
// ['code' => '04', 'name' => 'CALABARZON', 'designation' => 'Region IV-A']
```

#### `$f->address->province(): array`

Returns one of ~80 PH provinces: `['code' => string, 'name' => string, 'region' => string]`. `region` is the parent region code.

```php
$f->address->province();
// ['code' => '0434', 'name' => 'Cavite', 'region' => '04']
```

#### `$f->address->street(): string`

Returns a single-line street like `"{number} {name} {type}"`. Names drawn from heroes / flowers / trees pools.

```php
$f->address->street();   // '8090 Burgos Avenue'
```

#### `$f->address->full(): string`

Composed full address: `"{street}, {province}, {region}"`.

```php
$f->address->full();
// '8090 Burgos Avenue, La Union, Ilocos Region'
```

---

### `$f->phone` — PH mobile and landline

#### `$f->phone->mobile(): string`

Returns a random PH mobile number in E.164 format. Network chosen randomly across Globe / Smart / Sun / DITO. The prefix is real — feeding it back into `phdevutils/core`'s `Phone::parseMobile` returns the same network.

```php
$f->phone->mobile();   // '+639171234567'
```

#### `$f->phone->mobileByNetwork(string $network): string`

Returns a mobile number with a prefix belonging to the given network. `$network` must be one of `'Globe'`, `'Smart'`, `'Sun'`, `'DITO'`.

```php
$f->phone->mobileByNetwork('Globe');   // '+639170123456'
$f->phone->mobileByNetwork('DITO');    // '+639950987654'
```

Throws `\InvalidArgumentException` for unknown networks.

#### `$f->phone->landline(): string`

Returns a PH landline with a real area code. Metro Manila numbers use 8-digit subscribers, others 7-digit.

```php
$f->phone->landline();   // '(02) 8123-4567'
$f->phone->landline();   // '(32) 234-5678'
```

---

### `$f->id` — government IDs (format-valid only)

> ⚠️ All generated IDs are **format-valid only**. They follow the right digit count and shape but may collide with real persons' IDs by chance. **Use for tests only.** Never submit faker output to BIR, SSS, PhilHealth, Pag-IBIG, or any production system.

#### `$f->id->tin(bool $withBranch = true): string`

Returns a BIR TIN. With `$withBranch: true` (default) returns 12 digits `XXX-XXX-XXX-XXX`; with `false` returns 9 digits `XXX-XXX-XXX`.

```php
$f->id->tin();        // '123-456-789-000'
$f->id->tin(true);    // '123-456-789-456' (with branch)
$f->id->tin(false);   // '123-456-789'     (individual, no branch)
```

#### `$f->id->sss(): string`

Returns a 10-digit SSS number formatted `XX-XXXXXXX-X`.

```php
$f->id->sss();   // '12-3456789-0'
```

#### `$f->id->philhealth(): string`

Returns a 12-digit PhilHealth ID formatted `XX-XXXXXXXXX-X`.

```php
$f->id->philhealth();   // '12-345678901-2'
```

#### `$f->id->pagibig(): string`

Returns a 12-digit Pag-IBIG MID formatted `XXXX-XXXX-XXXX`.

```php
$f->id->pagibig();   // '1234-5678-9012'
```

---

### `$f->money` — peso amounts

#### `$f->money->peso(int $min = 0, int $max = 10000): float`

Returns a random peso amount with centavos.

```php
$f->money->peso();              // 4218.73
$f->money->peso(100, 500);      // 387.21
```

#### `$f->money->salary(): float`

Returns a realistic PH monthly salary (PHP 15,000 – 80,000).

```php
$f->money->salary();   // 42158.50
```

#### `$f->money->price(): float`

Returns a sari-sari–scale price (PHP 5 – 500).

```php
$f->money->price();   // 87.25
```

---

### `$f->business` — PH-flavored business names

#### `$f->business->name(): string`

Returns a fake business name. Composes from three patterns picked randomly:

- `"{honorific} {given name} {suffix}"` — e.g. `Aling Nena Sari-Sari Store`, `Mang Pedro Carinderia`
- `"{initials} {suffix}"` — e.g. `RJ Trading`, `MNL Foods`
- `"{phrase} {suffix or last name}"` — e.g. `Doon Sa Kanto Cafe`, `Tindahan ni Reyes`

```php
$f->business->name();   // 'Aling Nena Sari-Sari Store'
$f->business->name();   // 'RJ Enterprises'
$f->business->name();   // 'Tindahan ni Reyes'
```

---

## Determinism

`new Faker($seed)` and `$f->seed($n)` make subsequent calls deterministic *within the same PHP runtime*. Same seed → same sequence.

Cross-language seed compatibility with the JS package is **not** guaranteed — JS uses mulberry32, PHP uses `\Random\Engine\Mt19937`.

Each `Faker` instance owns its own engine, so multiple instances with different seeds run independently — the package does not touch `mt_srand` global state.

## ⚠️ Important warnings

- **Government IDs** are format-valid only (see warning in `$f->id` section above).
- **Phone numbers** use real network prefixes but random subscriber digits. May collide with real numbers. Use for tests only.
- **Names** are curated from public sources. Celebrity names and political-dynasty surnames are deliberately excluded.

## License

MIT
