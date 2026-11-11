# ZLO security patch: orders and digital downloads

Apply from the project root (`~/zlo`) only after backing up your database and local `media/` files.

## What changes

- `src/collections/Orders.ts`: only admins may create orders via Payload REST/GraphQL. The trusted Checkout Server Action still creates orders with `overrideAccess: true`.
- `src/collections/Media.ts`: adds `isProtected` checkbox and restricts direct file reads for protected originals; only admins may manage Media. Payload upload access rules also apply to URLs for files served by Payload.
- `src/collections/Artworks.ts`: only admins may change artworks. When a digital artwork is saved, its `digitalFile` Media record is automatically marked as protected. The `digitalFile` relation is no longer exposed through the public Artwork API.
- `src/app/(frontend)/[locale]/account/orders/download/route.ts`: validates user ownership, completed/paid order and purchased digital item; serves local bytes with attachment headers instead of redirecting to public Media URL.
- `scripts/protect-digital-media.ts`: marks the existing referenced digital originals as protected ONCE after schema update.

## Apply

1. Stop `npm run dev`. Save backup of DB and `media/`, then create a git branch.
2. Copy the `src/` and `scripts/` folders from this zip into project root, preserving paths.
3. Load Node 22 (`. "$HOME/.nvm/nvm.sh" && nvm use 22`).
4. `npx payload generate:types`
5. Start `npm run dev`. Let Payload add `media.isProtected` to the database (review any schema prompt).
6. In another terminal from project root, run:

   `npx payload run scripts/protect-digital-media.ts`

   It must print `Migration finished successfully.`. Do not skip this: existing originals would otherwise remain publicly reachable.
7. `npx tsc --noEmit` and `npm run build` (stop dev for clean build if necessary).
8. Run the tests below.

## Tests

- Public artwork gallery images still load.
- In a private browser window, request a `digitalFile` Media URL (`/api/media/file/<filename>`). Expected: 403/404 (not 200).
- Log in with a regular paid buyer and use Download in Account. Expected: HTTP 200 and attachment download.
- Log out and try the account download URL. Expected: redirect to Login, no file bytes.
- A regular authenticated user must not be able to create a paid order through `/api/orders`. Expected: 403 (or other forbidden response).
- Stripe test card payment still creates a `pending/unpaid` order, and webhook makes it `completed/paid`.

## Important caveats

- Local media directory only: not ready for S3/CDN deployments without adapting the custom download route.
- Use a DIFFERENT Media record for public previews and the paid original. If the same Media ID is used for both, the preview will become private, by design.
- `Media` files and old paid originals that were already committed to a *public GitHub repository* remain obtainable from Git history. Check `git ls-files media`. Remove any originals from repository/history and rotate/re-export paid assets before real sales.
- Stripe webhook still needs separate hardening: verify session ID, amount, currency and order owner before marking paid; ignore stale or failed attempts. This patch does not change it.
- Large files are read into memory on download. For production-sized originals use streaming + durable private object storage.
- This patch was reviewed statically, but could not be built against your local dependencies / PostgreSQL here. Run the listed checks and send build errors before proceeding.
