# ZLATA — Shop + Portfolio + Projects (physical sales via Contact only)

## Important

This REPLACES the older `zlo-shop-portfolio-patch.zip` proposal, which the user has **not installed**. Do not apply both patches. Based on the working security patch, types fix, and Stripe hardening already installed locally.

## Business rules

- Digital works: Shop > Add to Cart > Stripe Checkout > Downloads after verified payment. May sell repeatedly (subject to licensing rights).
- Physical paintings: Shop > Contact Artist; **never** Stripe/cart. The Contact form is prefilled with the painting's title. When sold, artist manually marks `availability = sold` in Payload. The work disappears from Shop (including direct Shop detail URL), but can remain in Portfolio if selected.
- Professional client/company/freelance experience: a separate `Projects` collection. No price, checkout, or purchase button. A project is public only when `visibility = published` and the artist has publishing rights.
- Selected personal arts and physical paintings: one `Artworks` record can be displayed in both areas via `showInShop` / `showInPortfolio`.
- Digital originals remain protected in Media and are not used as public previews.

## New/admin fields

Artworks:
- `Show in Shop` (default true for compatibility with old Shop entries). Physical `sold` or any `isPurchasable=false` entry is filtered out.
- `Show in Portfolio` (default false). Enable manually for selected physical paintings or personal art. **Existing artworks may not show up in Portfolio until selected.**
- `Offer for sale / inquiry` (stored as `isPurchasable`, default true for old data).
- `price`: no longer required, allowing physical paintings with "Price on request". Digital Checkout requires positive price.

Projects: title, slug, visibility, projectType, company, client, role, dates, summary, description, contribution, cover, gallery, videos, skills, tools, externalLink, featured. For professional portfolio only.

## Installation

Back up database, uploaded originals and source files FIRST. A git branch or commit is recommended. Keep the current working Stripe webhook intact. Stop the dev server first.

```sh
cd ~/zlo
git status --short
# archive a backup of any locally modified files if necessary
unzip -o zlo-shop-portfolio-contact-patch.zip
. "$HOME/.nvm/nvm.sh"
nvm use 22
npx payload generate:types
npx tsc --noEmit
npm run dev
```

Payload will add new columns to Artworks and the new Projects table during schema synchronization. No existing table or column should be removed. If Payload proposes dropping any existing tables/columns, **STOP** and review rather than proceeding.

The supplied `src/payload.config.ts` is based on the repository's config. If you have locally added plugins/customizations, merge the single `Projects` import/collection instead of blindly overwriting them.

## Smoke tests

1. Visit `/en/shop` and `/en/portfolio` (also `/fr/...` and `/ru/...`); Header shows both links.
2. Add a physical painting with `availability=available`, `showInShop=true`, `isPurchasable=true`, optional price; Shop detail must show "Contact Artist About This Painting", not Add to Cart.
3. Clicking the physical painting link loads `/en/contact?artwork=<slug>` and pre-fills subject/message; submitting creates a ContactMessages entry in Payload Admin (no outbound email yet).
4. Mark painting `availability=sold`; it disappears from Shop and cannot be accessed through its Shop detail URL; if `showInPortfolio=true` it stays in Portfolio (not as a purchasable item).
5. Add a digital artwork with `price>0`, `showInShop=true`, `isPurchasable=true`; test cart, sandbox Stripe purchase, Downloads, unauthorized download rejection. Existing bought files remain downloadable.
6. Create a Project draft; direct `/en/portfolio/projects/<slug>` must 404. Set published; it appears in Portfolio and detail route; no cart/price.
7. Select some artworks for Portfolio by enabling `showInPortfolio`. Unselected artworks should not appear there.
8. Check home FeaturedWorks, Favorites, Orders, Downloads, contact submission, and site navigation.

**Messages are currently stored in Payload only. The contact form does not automatically send an email to Zlata.** Real email notifications must be configured later.

## Limits

- **No automatic sale marking for physical work**, because sales happen outside this website. Manually mark `sold` in Payload after a confirmed sale.
- No payment, inventory reservation, or delivery details for physical paintings.
- No project translation yet (future stage). UI currently has English text, like the existing site.
- Draft project visibility checks are enforced in both access control and page queries. Still ensure all cover/gallery media is safe for public access and that clients grant publication rights.
- The public Repo and locally modified files could differ. Code was syntax-checked, but cannot be compiled against your local dependencies/PostgreSQL here. Run `npx tsc --noEmit` and review warnings.
- Old links: artwork `/portfolio/<slug>` continues or redirects to `/shop/<slug>` where applicable. Selected sold physical painting portfolio links remain valid.
- ContactMessages: public create remains; read/update/delete become admin-only, and public submissions are always marked new. This is important for private buyer inquiries. Add spam/rate limiting and a real email adapter before production.
