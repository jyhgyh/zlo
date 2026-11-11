import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPayloadClient } from "@/lib/payload";

export const runtime = "nodejs";

function toPayloadId(value: string): number | null {
  const numberValue = Number(value);
  return Number.isSafeInteger(numberValue) && numberValue > 0
    ? numberValue
    : null;
}

async function markOrderPaid({
  orderId,
  stripeSessionId,
  stripePaymentIntentId,
}: {
  orderId: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
}) {
  const numericOrderId = toPayloadId(orderId);
  if (numericOrderId === null) return;

  const payload = await getPayloadClient();
  await payload.update({
    collection: "orders",
    id: numericOrderId,
    data: {
      status: "completed",
      paymentStatus: "paid",
      ...(stripeSessionId ? { stripeSessionId } : {}),
      ...(stripePaymentIntentId ? { stripePaymentIntentId } : {}),
    },
    overrideAccess: true,
  });
}

async function markOrderCancelled({
  orderId,
  stripeSessionId,
  stripePaymentIntentId,
}: {
  orderId: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
}) {
  const numericOrderId = toPayloadId(orderId);
  if (numericOrderId === null) return;

  const payload = await getPayloadClient();
  const currentOrder = await payload.findByID({
    collection: "orders",
    id: numericOrderId,
    depth: 0,
    overrideAccess: true,
  });

  if (currentOrder.paymentStatus === "paid") return;

  await payload.update({
    collection: "orders",
    id: numericOrderId,
    data: {
      status: "cancelled",
      paymentStatus: "unpaid",
      ...(stripeSessionId ? { stripeSessionId } : {}),
      ...(stripePaymentIntentId ? { stripePaymentIntentId } : {}),
    },
    overrideAccess: true,
  });
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is missing" },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const body = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId && session.payment_status === "paid") {
      await markOrderPaid({
        orderId,
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : undefined,
      });
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      await markOrderPaid({
        orderId,
        stripePaymentIntentId: paymentIntent.id,
      });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await markOrderCancelled({
        orderId,
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : undefined,
      });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      await markOrderCancelled({
        orderId,
        stripePaymentIntentId: paymentIntent.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}
