# ArabDevKit

> Open-source developer infrastructure for software built for the Arab world.

ArabDevKit gives developers a consistent API for country-aware data, Arabic text handling, phone normalization, money formatting, validation, and eventually reusable schemas, components, test data, and project-readiness checks.

## Why?

Software teams across the Arab world repeatedly rebuild the same local plumbing: Arabic text normalization, local phone handling, currencies, country metadata, validation rules, localized test data, and framework-specific helpers. ArabDevKit turns that fragmented work into one tested, community-maintained developer toolkit.

## Status

**Early development — v0.1**

Country registry: **22 Arab markets**, with ISO codes, Arabic/English names, calling codes, locales, and currency metadata.

The first deeply-tested country modules are Saudi Arabia, UAE, Egypt, and Syria; country-specific regulatory validators are added only when backed by authoritative specifications.

## Packages

| Package | Purpose | Status |
| --- | --- | --- |
| `@arabdevkit/core` | Countries, Arabic text, digits, phone, money | 🚧 Active |
| `@arabdevkit/zod` | Country-aware Zod schemas | 🚧 Active |
| `@arabdevkit/react` | Localized inputs and form primitives | Planned |
| `@arabdevkit/faker` | Structurally valid local test data | Planned |
| `@arabdevkit/cli` | Project audit and country-readiness checks | Planned |

## Quick start

```bash
pnpm add @arabdevkit/core
```

```ts
import {
  findCountryByCallingCode,
  formatMoney,
  formatPhoneE164,
  getCountry,
  listCountries,
  normalizeArabic,
  toLatinDigits
} from "@arabdevkit/core";

normalizeArabic("إِلَى السُّعُودِيَّةِ");
// "الي السعودية"

toLatinDigits("رقم الطلب ١٢٣٤٥");
// "رقم الطلب 12345"

getCountry("AE");
// { code: "AE", defaultCurrency: "AED", callingCode: "+971", ... }

listCountries().length;
// 22

findCountryByCallingCode("+974")?.code;
// "QA"

formatMoney(199, "SA");
// localized SAR output

formatMoney(50, "PS", { currency: "JOD" });
// Palestine has no single default currency, so currency is explicit

formatPhoneE164("0501234567", "SA");
// "+966501234567"
```

### Zod

```ts
import { z } from "zod";
import { sa } from "@arabdevkit/zod";

const customer = z.object({
  phone: sa.phone()
});
```

## Design principles

1. **One API across countries.** Country differences should not force every team to invent a new abstraction.
2. **Verified, not guessed.** Regulatory and identifier validators require authoritative specifications and tests.
3. **Framework-independent core.** React, Zod, Faker, and CLI integrations live in separate packages.
4. **Arabic is first-class.** Arabic digits, Unicode, text normalization, RTL-oriented workflows, and Arabic/English locales are core concerns.
5. **Community-expandable.** Adding a country or capability should be predictable and reviewable.

## Roadmap

### v0.1 — Foundation
- [x] Monorepo architecture
- [x] Country registry
- [x] Registry for 22 Arab markets
- [x] Saudi Arabia, UAE, Egypt, Syria foundational modules
- [x] Arabic text normalization
- [x] Arabic-Indic / Latin digit conversion
- [x] International phone parsing and validation
- [x] Localized currency formatting
- [x] Zod phone schemas
- [x] CI pipeline

### v0.2 — Country primitives
- [ ] Country-specific address models
- [ ] Postal-code helpers where applicable
- [ ] Verified tax/business identifier validators
- [ ] IBAN helpers and country constraints
- [ ] Province/governorate datasets with provenance

### v0.3 — Developer experience
- [ ] `@arabdevkit/faker`
- [ ] `@arabdevkit/react`
- [ ] CLI
- [ ] `arabdevkit check --country <code>`
- [ ] Framework examples

### v1.0
- [ ] Broad Arab-country coverage
- [ ] Stable API guarantees
- [ ] Contributor-driven country modules
- [ ] Documentation website

## Contributing

Contributions are welcome, especially country modules backed by authoritative sources. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before adding regulatory or identity validation rules.

## License

MIT © 2026 Mohammed Al-Obaido
