import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPayloadClient } from "@/lib/payload";

export const runtime = "nodejs";

type PaymentEventAction = "complete" | "expired";

function parseId(value: unknown): number | null {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function getRelationId(value: unknown): string | null {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object" && value !== null && "id" in value) {
    const id = value.id;
    if (typeof id === "string" || typeof id === "number") {
      return String(id);
    }
  }

  return null;
}

function asCents(value: number): number | null {
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }

  const cents = Math.round(value * 100);
  return Number.isSafeInteger(cents) ? cents : null;
}

async function processCheckoutSession(
  sessionId: string,
  action: PaymentEventAction
): Promise<void> {
  // Retrieve the latest state directly from Stripe. Do not trust only the
  // event name or the metadata from an event payload.
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = parseId(session.metadata?.orderId);

  if (orderId === null) {
    // Stripe CLI test fixtures can produce events without our orderId.
    console.info(`Skipping Stripe Session ${session.id}: no valid orderId`);
    return;
  }

  const payload = await getPayloadClient();
  const order = await payload.findByID({
    collection: "orders",
    id: orderId,
    depth: 0,
    overrideAccess: true,
  });

  const storedUserId = getRelationId(order.user);
  const sessionPaymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  // Confirm that this payment is for exactly this order and account.
  if (
    session.mode !== "payment" ||
    storedUserId === null ||
    session.metadata?.userId !== storedUserId ||
    (order.stripeSessionId && order.stripeSessionId !== session.id) ||
    (order.stripePaymentIntentId &&
      order.stripePaymentIntentId !== sessionPaymentIntent)
  ) {
    console.error(`Stripe Session ${session.id}: order binding mismatch`);
    return;
  }

  if (!Array.isArray(order.items) || order.items.length === 0) {
    console.error(`Stripe Session ${session.id}: order has no items`);
    return;
  }

  // Our current Checkout has no discounts, tax adjustments or shipping.
  // It charges one unit of each order item at its snapshotted price.
  let expectedAmount = 0;
  let expectedTotal = 0;

  for (const item of order.items) {
    if (
      item.type !== "digital" ||
      item.currency !== order.currency ||
      typeof item.price !== "number" ||
      item.price <= 0
    ) {
      console.error(`Stripe Session ${session.id}: invalid order item`);
      return;
    }

    const itemAmount = asCents(item.price);
    if (itemAmount === null) {
      console.error(`Stripe Session ${session.id}: invalid item amount`);
      return;
    }

    expectedAmount += itemAmount;
    expectedTotal += item.price;
  }

  if (
    !Number.isSafeInteger(expectedAmount) ||
    Math.abs(expectedTotal - order.total) > 0.000001 ||
    session.amount_total !== expectedAmount ||
    session.currency?.toUpperCase() !== order.currency
  ) {
    console.error(`Stripe Session ${session.id}: amount/currency mismatch`);
    return;
  }

  if (action === "complete") {
    // Checkout completion alone is insufficient for delayed payment types.
    if (session.status !== "complete" || session.payment_status !== "paid") {
      console.info(`Stripe Session ${session.id}: payment not confirmed yet`);
      return;
    }

    if (!sessionPaymentIntent) {
      console.error(`Stripe Session ${session.id}: missing PaymentIntent`);
      return;
    }

    // Replayed events must not restore access after a refund.
    if (order.paymentStatus === "refunded") {
      return;
    }

    if (order.paymentStatus === "paid" && order.status === "completed") {
      return; // Idempotent: already fulfilled.
    }

    await payload.update({
      collection: "orders",
      id: orderId,
      data: {
        status: "completed",
        paymentStatus: "paid",
        stripeSessionId: session.id,
        stripePaymentIntentId: sessionPaymentIntent,
      },
      overrideAccess: true,
    });

    console.info(`Order ${orderId} confirmed by Stripe Session ${session.id}`);
    return;
  }

  // An unsuccessful payment attempt does not mean the customer cannot retry
  // within the same Checkout Session. Cancel only when Stripe confirms expiry.
  if (session.status !== "expired" || session.payment_status === "paid") {
    return;
  }

  if (order.paymentStatus !== "unpaid" || order.status === "cancelled") {
    return;
  }

  await payload.update({
    collection: "orders",
    id: orderId,
    data: {
      status: "cancelled",
      stripeSessionId: session.id,
    },
    overrideAccess: true,
  });

  console.info(`Order ${orderId} expired with Stripe Session ${session.id}`);
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await processCheckoutSession(event.data.object.id, "complete");
        break;

      case "checkout.session.expired":
        await processCheckoutSession(event.data.object.id, "expired");
        break;

      // payment_intent.succeeded / payment_intent.payment_failed are not
      // fulfillment triggers. The verified Checkout Session is our authority.
      default:
        break;
    }
  } catch (error) {
    // A 5xx lets Stripe retry transient API/DB failures.
    console.error(`Error processing Stripe webhook ${event.id}:`, error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
