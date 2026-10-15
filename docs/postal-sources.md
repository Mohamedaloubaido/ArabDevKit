# Postal sources

ArabDevKit only asserts a postal-code rule when it is backed by an authoritative postal source.

## Saudi Arabia

Saudi Post | SPL documents the National Address as six key elements and states that the postal code is **5 digits**.

Sources:
- https://splonline.com.sa/en/business/
- https://splonline.com.sa/ar/national-address-1/

ArabDevKit validates only the five-digit structure. It does not claim that a structurally valid code belongs to a specific building or recipient.

## United Arab Emirates

Emirates Post's official UAE addressing format lists P.O. Box number, physical address, emirate, and telephone number. ArabDevKit therefore does not invent a UAE national postal-code rule and exposes the country profile as `po-box` oriented.

Sources:
- https://www.emiratespost.ae/faq
- https://www.emiratespost.ae/all-services/rent-personal-po-box

## Other Arab markets

Postal behavior remains `unverified` until a country-specific authoritative source and tests are added. Generic address forms must not be interpreted as evidence that a postal code is nationally required or structurally known.
