# ZLO Stripe webhook hardening

This patch replaces only `src/app/api/stripe/webhook/route.ts`.
It leaves Stripe Checkout, Payload schemas and previous paid orders unchanged.

## Install

1. Back up the project and database, or commit your current work to a branch.
2. Unzip into the root `~/zlo`, preserving paths.
3. Run `npx tsc --noEmit` and restart `npm run dev`.
4. Keep `stripe listen --events checkout.session.completed,checkout.session.expired,payment_intent.succeeded,payment_intent.payment_failed --forward-to localhost:3000/api/stripe/webhook` running.
5. Create a fresh test purchase (new digital artwork or an account that has not purchased it).
6. Confirm that the order is completed/paid and the buyer can download. Check that anonymous and non-buyers cannot download.
7. Test a declined card: `4000 0000 0000 0002`. The order must not become paid.
8. `stripe trigger payment_intent.succeeded` is expected to return HTTP 200, but *not* mark any order paid.

## Behavior

- Validates Stripe webhook signature and fetches a fresh Checkout Session from Stripe.
- Checks internal order ID and user, Session ID, payment intent, items, total and currency.
- Grants access only on Checkout Session completed AND paid.
- Ignores PaymentIntent events for fulfillment and failed attempts for cancellation.
- Cancels only expired, unpaid Checkout Sessions.
- Does not regress refunded orders to paid.

## Limits

- If Stripe Session fails business validation, the handler logs a warning and responds HTTP 200 without granting download. HTTP 200 does not always imply an order was paid: inspect the Payload order and server logs.
- No durable event ID table/queue is added. Replays are safe for the current simple status transitions, but exactly-once downstream actions (emails, inventory) need separate idempotency handling later.
- This assumes Checkout line items have quantity 1, no discounts/taxes/shipping, and prices use EUR/USD cents. Revisit these checks if Checkout changes.
- Does not handle refunds or disputes automatically.
- `checkout.session.completed` is sufficient for the current card-only payment flow. Add `checkout.session.async_payment_succeeded` if enabling delayed payment methods in the future.
