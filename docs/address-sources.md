# Address data sources

ArabDevKit treats country-specific address rules as sourced data, not assumptions.

## Saudi Arabia (`SA`)

Primary references:
- Saudi Post (SPL) National Address documentation: the National Address contains Building Number, Street, Secondary Number, District, Postal Code, and City. Building and secondary numbers are four digits; postal code is five digits; the short address is four letters plus four digits.
- Saudi National Platform / General Authority for Statistics: Saudi Arabia is divided into 13 administrative regions.

## United Arab Emirates (`AE`)

Primary references:
- Emirates Post FAQ: UAE shipment addressing uses name, P.O. Box, physical address (building name, street name, flat number), Emirate, and telephone number.
- Official UAE Government portal: the UAE consists of seven emirates — Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.

ArabDevKit intentionally does not assert a UAE postal-code rule in the address engine.

## Egypt (`EG`)

Primary reference:
- Egypt State Information Service: Egypt is divided into 27 governorates. The same official source groups and names all 27 governorates.

Postal code is exposed as an optional free-form field for now; ArabDevKit does not yet assert a country-wide postal-code validation rule.

## Syria (`SY`)

Primary reference:
- Syrian Ministry of Culture public portal: Syria consists of 14 governorates and lists Damascus, Rif Dimashq, Aleppo, Daraa, Quneitra, As-Suwayda, Homs, Hama, Tartus, Latakia, Idlib, Raqqa, Deir ez-Zor, and Al-Hasakah.

ArabDevKit does not currently assert a national postal-code validation rule for Syria.
