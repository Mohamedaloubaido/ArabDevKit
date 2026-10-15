# Next.js Saudi checkout example

A copyable App Router example showing how ArabDevKit can be used in a real Saudi checkout flow.

It demonstrates:

- Arabic + RTL form markup
- Saudi phone validation
- Saudi National Address field structure
- 5-digit postal-code validation
- optional Saudi VAT number validation
- server-side Zod validation in a Next.js Server Action
- region options sourced from the ArabDevKit country dataset

## Files

- `app/page.tsx` — Server Component checkout form
- `app/actions.ts` — Server Action that rebuilds and validates the payload on the server

## Packages

```bash
pnpm add @arabdevkit/core @arabdevkit/zod zod
```

Copy the `app/` files into a Next.js App Router project after installing the packages.

## Why validate twice?

Browser `required` and input modes improve UX, but they are not a trust boundary. The Server Action reconstructs the address and validates the full payload again before it reaches an order, database, or payment workflow.

## Production note

The tax-number check in this example is structural only. If your business flow requires proof of an active VAT registration, perform authoritative verification through ZATCA according to your application's requirements.
