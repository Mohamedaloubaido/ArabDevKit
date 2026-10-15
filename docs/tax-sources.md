# Tax identifier sources

ArabDevKit tax identifier validators are intentionally **structural only**. They validate documented field shape/length and normalize Arabic-Indic digits; they do not query tax authorities or confirm that a registration is active.

## Saudi Arabia

Authority: Zakat, Tax and Customs Authority (ZATCA)

- ZATCA SME VAT guidance describes the Tax Number as a 15-digit number and the TIN as a 10-digit number.
- Official VAT registration lookup supports searches by tax number, VAT certificate number, or unified commercial registration number.

Sources:
- https://zatca.gov.sa/en/HelpCenter/guidelines/Documents/%28SMEs%29%20Guidelines%20%E2%80%93%20Zatca%201.pdf
- https://www.zatca.gov.sa/ar/eServices/Pages/TaxpayerLookup.aspx

## United Arab Emirates

Authority: Federal Tax Authority (FTA)

- FTA tax accounting software requirements define TRN as `String[15]`.
- FTA public services expose a 15-character TRN verification field.

Sources:
- https://tax.gov.ae/DataFolder/Files/Pdf/requirement-document-for-tax-accounting-software.pdf
- https://tax.gov.ae/

## Validation boundary

Passing ArabDevKit validation means only that the identifier matches the configured structural rule. It does **not** prove ownership, registration status, tax type, or legal validity. Applications that require authoritative confirmation should direct the user to the relevant authority or integrate an officially supported verification service where available and permitted.
