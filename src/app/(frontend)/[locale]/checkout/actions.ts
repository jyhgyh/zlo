"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { getPayloadClient } from "@/lib/payload";
import { stripe } from "@/lib/stripe";
import { getPaidArtworkIdsByUser } from "@/lib/orders";

type RawCartItem = {
  id?: string;
  image?: string;
};

type OrderItem = {
  artwork: string | number;
  title: string;
  slug: string;
  image: string;
  price: number;
  currency: "EUR" | "USD";
  type: "digital";
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function toPayloadId(value: string): string | number {
  const numberValue = Number(value);

  if (!Number.isNaN(numberValue) && value !== "") {
    return numberValue;
  }

  return value;
}

function parseCartItems(value: string): RawCartItem[] {
  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

function getFirstImageFromArtwork(doc: Record<string, unknown>) {
  const gallery = Array.isArray(doc.gallery) ? doc.gallery : [];
  const first = gallery[0];

  if (
    typeof first === "object" &&
    first !== null &&
    "media" in first
  ) {
    const media = first.media;

    if (
      typeof media === "object" &&
      media !== null &&
      "url" in media &&
      typeof media.url === "string"
    ) {
      return media.url;
    }
  }

  return "";
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  return "http://localhost:3000";
}

function toStripeAmount(price: number) {
  return Math.round(price * 100);
}

export async function createOrder(formData: FormData) {
  const locale = getFormValue(formData, "locale") || "en";
  const cartJson = getFormValue(formData, "cart");

  const customerName = getFormValue(formData, "customerName");
  const customerEmail = getFormValue(formData, "customerEmail");
  const notes = getFormValue(formData, "notes");

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const rawCartItems = parseCartItems(cartJson);

  if (rawCartItems.length === 0) {
    redirect(`/${locale}/checkout?error=empty-cart`);
  }

  if (!customerName || !customerEmail) {
    redirect(`/${locale}/checkout?error=missing-fields`);
  }

  const payload = await getPayloadClient();

  const alreadyPurchasedIds = await getPaidArtworkIdsByUser(user.id);

  const orderItems: OrderItem[] = [];

  for (const item of rawCartItems) {
    if (!item.id) {
      continue;
    }

    if (alreadyPurchasedIds.includes(String(item.id))) {
      continue;
    }

    try {
      const artwork = await payload.findByID({
        collection: "artworks" as never,
        id: toPayloadId(item.id),
        depth: 2,
      });

      const artworkData = artwork as Record<string, unknown>;

      if (artworkData.type !== "digital") {
        continue;
      }

      const price =
        typeof artworkData.price === "number"
          ? artworkData.price
          : 0;

      const currency =
        artworkData.currency === "USD" ? "USD" : "EUR";

      if (price <= 0) {
        continue;
      }

      orderItems.push({
        artwork: toPayloadId(item.id),
        title: String(artworkData.title ?? "Untitled artwork"),
        slug: String(artworkData.slug ?? ""),
        image: item.image || getFirstImageFromArtwork(artworkData),
        price,
        currency,
        type: "digital",
      });
    } catch {
      continue;
    }
  }

  if (orderItems.length === 0) {
    redirect(`/${locale}/checkout?error=already-purchased`);
  }

  const currency = orderItems[0].currency;

  const hasMixedCurrency = orderItems.some(
    (item) => item.currency !== currency
  );

  if (hasMixedCurrency) {
    redirect(`/${locale}/checkout?error=mixed-currency`);
  }

  const total = orderItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const order = await payload.create({
    collection: "orders" as never,
    data: {
      user: user.id,
      items: orderItems,
      total,
      currency,
      status: "pending",
      paymentStatus: "unpaid",
      customerName,
      customerEmail,
      notes,
    },
    overrideAccess: true,
  });

  const orderId =
    typeof order === "object" &&
    order !== null &&
    "id" in order
      ? String(order.id)
      : "";

  if (!orderId) {
    redirect(`/${locale}/checkout?error=create-failed`);
  }

  const baseUrl = getBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    customer_email: customerEmail,

    line_items: orderItems.map((item) => ({
      quantity: 1,
      price_data: {
        currency: item.currency.toLowerCase(),
        unit_amount: toStripeAmount(item.price),
        product_data: {
          name: item.title,
        },
      },
    })),

    success_url: `${baseUrl}/${locale}/checkout/success?order=${orderId}`,
    cancel_url: `${baseUrl}/${locale}/checkout?cancelled=1`,

    metadata: {
      orderId,
      userId: String(user.id),
    },

    payment_intent_data: {
      metadata: {
        orderId,
        userId: String(user.id),
      },
    },
  });

  await payload.update({
    collection: "orders" as never,
    id: toPayloadId(orderId),
    data: {
      stripeSessionId: session.id,
    },
    overrideAccess: true,
  });

  if (!session.url) {
    redirect(`/${locale}/checkout?error=stripe-session`);
  }

  redirect(session.url);
}