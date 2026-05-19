# ph-faker data

Source notes for transparency. All data is curated for use as **fake test data only**.

## Files

### `regions.json`, `provinces.json`, `network-prefixes.json`
Copied verbatim from [`ph-dev-utils`](https://github.com/kon2raya24/ph-dev-utils) `data/`. Same source of truth — keep in sync when ph-dev-utils updates.

### `first-names-male.json`, `first-names-female.json`
Curated list of common Filipino given names. Drawn from general knowledge of widely-used names in the Philippines. Not sourced from any specific person, registry, or proprietary dataset. Names like `Maria`, `Juan`, `Jose` are public-domain cultural patterns.

### `last-names.json`
Curated list of common Filipino surnames, mixing native, Spanish-origin (from the 1849 Catálogo Alfabético de Apellidos), and Chinese-Filipino patterns. **Politically-loaded surnames** (heads of state, major political dynasties) have been deliberately excluded to reduce the chance of fake-data outputs reading as references to specific living public figures.

### `business-words.json`, `street-words.json`
Generic word fragments composed into business/street names. No real registered business or street is referenced; combinations are statistically unlikely to match any specific real entity, but if they do, it is coincidental.

## Adding entries

PRs welcome. Please:
- Avoid celebrity names, names of living public figures, or names of specific real businesses.
- For surnames, prefer broadly distributed common names over rare/distinctive ones.
- Cite the source if drawing from a public dataset.
