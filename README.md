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
| `@arabdevkit/core` | Countries, Arabic text, digits, phone, money, IBAN | 🚧 Active |
| `@arabdevkit/zod` | Country-aware Zod schemas | 🚧 Active |
| `@arabdevkit/react` | Accessible country, phone, and IBAN input primitives | 🚧 Active |
| `@arabdevkit/faker` | Seedable synthetic people, addresses, companies, phones, and IBANs | 🚧 Active |
| `@arabdevkit/cli` | Country inspection, IBAN/phone validation, Arabic normalization | 🚧 Active |

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
  isValidIban,
  listCountries,
  parseIban,
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

isValidIban("SA03 8000 0000 6080 1016 7519", "SA");
// true

parseIban("JO94 CBJO 0010 0000 0000 0131 0003 02");
// { countryCode: "JO", bankIdentifier: "CBJO", branchIdentifier: "0010", ... }
```

## IBAN coverage

ArabDevKit validates ISO 13616 structure + BBAN country format + MOD-97 checksum for **18 Arab markets** currently present in the SWIFT IBAN Registry:

`AE` `BH` `DJ` `EG` `IQ` `JO` `KW` `LB` `LY` `MR` `OM` `PS` `QA` `SA` `SD` `SO` `TN` `YE`

Country metadata remains available for all 22 Arab markets; absence from this IBAN list means ArabDevKit does not claim an ISO 13616 national IBAN format for that market.

```ts
import { createIban, formatIban, getArabIbanSpec, isValidIban, parseIban } from "@arabdevkit/core";

isValidIban("AE07 0331 2345 6789 0123 456", "AE"); // true
formatIban("EG380019000500000000263180002");
getArabIbanSpec("QA").ibanLength; // 29
parseIban("IQ98NBIQ850123456789012")?.bankIdentifier; // "NBIQ"
createIban("SA", "80000000608010167519"); // "SA0380000000608010167519"
```

### Zod

```ts
import { z } from "zod";
import { sa } from "@arabdevkit/zod";

const customer = z.object({
  phone: sa.phone(),
  iban: sa.iban()
});
```

### Faker

```ts
import { createArabFaker, faker } from "@arabdevkit/faker";

const sa = createArabFaker("SA", { seed: 42 });

sa.person();
sa.address();
sa.company();
sa.phone();
sa.iban();

faker.eg.person();
faker.ae.address();
```

Faker data is synthetic test data. Phone generation is derived from `libphonenumber-js` mobile example metadata and revalidated before being returned. Generated IBANs match the configured country structure and MOD-97 checksum, but **must never be treated as real bank accounts or used for payments**.

### React

`@arabdevkit/react` provides unstyled, accessible primitives that reuse the same core country and validation logic. All native input/select props are passed through so teams keep control over styling and form libraries.

```tsx
import { ArabPhoneInput, CountrySelect, IbanInput } from "@arabdevkit/react";

<CountrySelect
  language="ar"
  includeCallingCode
  onCountryChange={(country) => console.log(country.code)}
/>;

<ArabPhoneInput
  country="SA"
  value={phone}
  onValueChange={(next, state) => {
    setPhone(next);
    console.log(state.valid, state.e164);
  }}
/>;

<IbanInput
  country="AE"
  value={iban}
  onValueChange={(next, state) => {
    setIban(next);
    console.log(state.valid);
  }}
/>;
```

The components are intentionally unstyled. They expose country metadata and validity through callbacks/data attributes rather than imposing a design system.

## CLI

```bash
pnpm add -g @arabdevkit/cli

arabdevkit country SA
arabdevkit iban "SA03 8000 0000 6080 1016 7519" --country SA
arabdevkit phone "0501234567" --country SA
arabdevkit normalize "إِلَى السُّعُودِيَّةِ ١٢٣"
arabdevkit check --country SA --path .
arabdevkit fake person --country SA --count 5 --seed 42
arabdevkit fake iban --country AE --json
```

Every data command also supports `--json`, making the CLI usable in shell scripts and CI workflows.

### Country readiness audit

`arabdevkit check` scans source/config files for country-specific engineering signals such as Arabic locale configuration, RTL handling, local currency awareness, phone normalization, Arabic digits, centralized country metadata, and IBAN handling where applicable.

```bash
arabdevkit check --country AE --path ./my-app
```

The resulting score is explicitly **heuristic**. It is a developer checklist, not a legal, regulatory, accessibility, security, or production-readiness certification.

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
- [x] IBAN helpers and country constraints (18 SWIFT-registered Arab markets)
- [ ] Province/governorate datasets with provenance

### v0.3 — Developer experience
- [x] `@arabdevkit/faker` foundation
- [x] `@arabdevkit/react` foundation
- [x] CLI foundation
- [x] `arabdevkit check --country <code>`
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
