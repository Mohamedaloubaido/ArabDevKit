# Business registry sources

ArabDevKit treats business registration identifiers differently from purely structural identifiers such as an IBAN.

For the registries below, ArabDevKit exposes **official verification routes** and intentionally does not claim local regex validation where an authoritative full identifier specification has not been established in the project.

## Saudi Arabia

Authority: Ministry of Commerce

The Ministry's commercial registration data query service supports searching by establishment name or the establishment's Unified National Number.

Source:
- https://mc.gov.sa/en/eservices/pages/ServiceDetails.aspx?sID=91

ArabDevKit therefore marks the Saudi commercial registration/unified-national-number flow as `verification-only` rather than inventing a complete structural validator.

## United Arab Emirates

Authority: Ministry of Economy and Tourism / National Economic Register

The UAE National Economic Register provides access to business licence data. The official register interface supports searching by economic name, local licence number, or economic register number, and the UAE government also lists emirate-level licensing authorities.

Sources:
- https://u.ae/en/information-and-services/business/important-digital-services/national-economic-register
- https://u.ae/en/information-and-services/business/important-digital-services/inquire-about-licences-names-and-activities
- https://ner.economy.ae/

Because licensing is distributed across multiple authorities and identifier schemes, ArabDevKit exposes official verification metadata instead of treating every UAE licence number as one universal format.
