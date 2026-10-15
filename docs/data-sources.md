# ArabDevKit data sources

ArabDevKit only adds country-specific financial or regulatory rules when they are backed by an authoritative source.

## IBAN

- Registration authority: SWIFT, acting as the ISO 13616 registration authority.
- Country formats are sourced from the SWIFT IBAN Registry.
- The implementation stores each market's IBAN length, BBAN structure, bank/branch identifier positions, and an official example.
- Validation combines country structure checks with the ISO 13616 MOD-97 checksum.

The SWIFT standards resource page listed IBAN Registry Release 103 on 17 September 2026. The country structures used by the initial ArabDevKit implementation were cross-checked against the official SWIFT registry records available during development.

When a registry revision changes a national format, update the corresponding spec and its official-example test in the same pull request.
