# ZLO: TypeScript corrections + executable media migration

This ZIP is designed for the earlier `zlo-security-patch.zip`. It does NOT replace
`src/collections/Media.ts`, `Orders.ts` or `Artworks.ts` and does not undo their
security settings.

## Changes

- Correct Payload typing for Checkout, Stripe webhook, and Favorites (PostgreSQL integer IDs).
- Fix three TS conversion errors in protected download route.
- Fix next-intl fallback locale.
- Fix Site Settings and Orders data normalization typing.
- Preserve six demo records and add missing gallery/categories.
- Export the documented `script` entry point so `payload run` can execute
  the protection migration.

## Installation

1. Keep a database backup and retain the old security patch files.
2. In `~/zlo`, extract this zip without deleting other source files.
3. `. "$HOME/.nvm/nvm.sh" && nvm use 22`
4. `npx payload generate:types`
5. `npx tsc --noEmit`
6. Start PostgreSQL + `npm run dev` (check that new isProtected field has been applied).
7. In a separate terminal run `npx payload run scripts/protect-digital-media.ts`.
   It MUST print `Migration finished successfully.`. If blank, DO NOT presume it ran.
8. Check a paid original Media record has `isProtected = true` in Payload Admin.
9. Check public gallery images load; anonymous URLs of protected originals fail;
   a paid buyer can still download through their account.

## Notes

- Static `src/data/artworks.ts` is demo data, not the real Payload content.
- Existing Stripe webhook business validation (session/amount/currency) remains
  work for a later security patch. Do not use live payments yet.
- Old originals published in Git history or a public storage/CDN remain leaked.
- Do not delete `src/payload-types.ts` or the database.

If `tsc` still reports errors, send its exact output.
