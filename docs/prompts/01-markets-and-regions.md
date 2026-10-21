# LUXORA — Target Markets & Regional Commerce (add to existing architecture)

Context: LUXORA is a real online store. Main markets: UAE (Dubai), Canada, Iran, and Oman. Inspect the existing repo first and extend it; do not rebuild working code.

## 1. Region model (not just language)
- Locales: `en`, `fa` (RTL). Add `ar` (RTL) as optional, behind a config flag, for UAE/Oman.
- Regions: `AE`, `CA`, `IR`, `OM`. Region is separate from language (e.g. en-AE, en-CA, fa-IR, ar-OM).
- URL strategy: `/[locale]/...` plus a region selector stored in a cookie; region drives currency, shipping, payment, tax, and which products are available.
- hreflang uses language-region pairs where pages genuinely differ; avoid duplicate-content conflicts; canonical per URL.

## 2. Currency (never silently convert)
- Per-region price lists stored in DB (exact Decimal): AED, CAD, OMR (3 decimals), IRR.
- Iran: store in Rial; UI may show Toman (÷10) with a clear label. Persian digits in `fa`.
- No live FX conversion for charging; each region has its own explicit price (or a documented, admin-set conversion rule).
- Prices, VAT/GST/tax display rules per region configurable in admin (UAE VAT, Canada GST/HST/PST by province, Oman VAT). Do not hardcode rates; mark as "to be confirmed by owner/accountant".

## 3. Payments — provider adapters per region
- Adapter interface; one active provider per region, configured in admin/env.
- UAE/Oman/Canada: an international provider supported in that country (owner must choose and open an account). Sandbox first.
- Iran: international card providers are generally unavailable; use an Iranian gateway adapter (e.g. Shaparak-based gateways) which requires an Iranian business entity/merchant account. Build the adapter and sandbox flow; do not assume credentials.
- Verify webhooks/callbacks, idempotent order creation, no raw card data stored.
- Optional per-region cash-on-delivery or bank transfer, configurable.

## 4. Shipping & logistics
- Shipping zones/methods/rates per region, editable in admin; delivery times shown only if configured.
- Address forms per country (Iran: province/city/postal code 10 digits, Persian input; UAE: emirate/area, no strict postcode; Canada: province + postal code format A1A 1A1; Oman: governorate/wilayat).
- Phone validation per country.
- Cross-border restrictions: product availability per region (some products/brands may be unavailable in some regions); enforce on server.

## 5. Warranty, voltage, plugs
- Hair tools differ by plug type/voltage and warranty by region. Product model supports per-region warranty text, plug type, voltage, and "regional variant" flag. Show only verified data; otherwise show nothing.

## 6. Compliance flags (do not decide silently — document for the owner)
- Selling into Iran and Canada/UAE from one business involves sanctions/export-control, payment-processor terms, and tax rules. Add `docs/COMPLIANCE-CHECKLIST.md` listing questions for a lawyer/accountant. Do not claim legal compliance.
- Per-region legal pages (privacy, terms, returns) editable in admin.

## 7. SEO per region
- Localized titles/meta, region-specific structured data (Offer priceCurrency/availability/shipping only when real).
- Sitemaps per locale; hreflang validation tests.

## 8. Acceptance
- Switching region changes currency, available products, shipping options, payment methods, and tax display, and survives refresh and login.
- Tests: region/currency pricing, IRR/Toman display, per-region availability, address validation per country, RTL checkout.
- Report what is implemented vs. what needs owner credentials/decisions.
