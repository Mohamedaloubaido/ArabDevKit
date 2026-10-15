# Contributing to ArabDevKit

ArabDevKit is intended to become community-maintained infrastructure for software built across the Arab world.

## Good first contributions

- Add a country-specific validator backed by an official public specification.
- Add verified geographic or locale data with a source.
- Add tests for Arabic text, digits, phone normalization, or formatting edge cases.
- Improve documentation and framework examples.

## Data quality rule

Country-specific rules must not be guessed. Every non-trivial identifier, tax, registration, address, banking, or regulatory rule must include a source in the pull request and tests covering valid and invalid examples.

## Development

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

## Package boundaries

- `@arabdevkit/core`: framework-independent primitives.
- `@arabdevkit/zod`: Zod validation schemas.
- Future packages: React, Faker, CLI, and country-readiness tooling.
