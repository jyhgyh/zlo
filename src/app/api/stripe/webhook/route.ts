import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPayloadClient } from "@/lib/payload";

export const runtime = "nodejs";

function toPayloadId(value: string): string | number {
  const numberValue = Number(value);

  if (!Number.isNaN(numberValue) && value.trim() !== "") {
    return numberValue;
  }

  return value;
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
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const payload = await getPayloadClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const orderId = session.metadata?.orderId;

    if (orderId) {
      await payload.update({
        collection: "orders" as never,
        id: toPayloadId(orderId),
        data: {
          status: "completed",
          paymentStatus: "paid",
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : undefined,
        },
        overrideAccess: true,
      });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;

    const orderId = session.metadata?.orderId;

    if (orderId) {
      await payload.update({
        collection: "orders" as never,
        id: toPayloadId(orderId),
        data: {
          status: "cancelled",
          paymentStatus: "unpaid",
          stripeSessionId: session.id,
        },
        overrideAccess: true,
      });
    }
  }

  return NextResponse.json({
    received: true,
  });
}