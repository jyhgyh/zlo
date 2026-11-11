# ZLO: digital originals migration (Payload + PostgreSQL)

This migration avoids importing Payload through `tsx` or `payload run`.
It uses the already-installed PostgreSQL command line client (`psql`) via Node.
It only updates `media.is_protected` for media IDs referenced by
`artworks.digital_file_id` where the artwork is digital.

## Installation

Copy/extract the `scripts/protect-digital-media.cjs` file into your project.
The previous `scripts/protect-digital-media.ts` is not needed for this migration.

## Use

Ensure `DATABASE_URL` is in `.env`, Node 22 and `psql` are available.
Back up the database first and keep the `media/` folder unchanged.

    node scripts/protect-digital-media.cjs

This is a dry run showing which originals are unprotected. No updates occur.

    node scripts/protect-digital-media.cjs --apply

This updates the identified originals and verifies them. If the table or
column names differ, the command stops with a SQL error; it will not try to
guess the database schema.

## After migration

- Confirm Media #3 isProtected is true.
- As a signed-in customer who owns paid order #9, retry its download.
- Check the media URL anonymously; it should no longer be public.
- Verify public gallery images are still displayed.
- If a preview image was also assigned as a digital original, it may stop
  being public: provide a separate preview media document in the artwork gallery.

CAUTION: files committed to a publicly accessible git repository cannot be
protected by Payload access controls; remove paid originals from git history.
