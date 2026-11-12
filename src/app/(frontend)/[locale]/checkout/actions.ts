"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { getPayloadClient } from "@/lib/payload";
import { stripe } from "@/lib/stripe";
import { getPaidArtworkIdsByUser } from "@/lib/orders";

type RawCartItem = {
  id?: string | number;
  image?: string;
};

type OrderItem = {
  artwork: number;
  title: string;
  slug: string;
  image: string;
  price: number;
  currency: "EUR" | "USD";
  type: "digital";
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function numericId(value: string | number): number | null {
  const numberValue = Number(value);
  return Number.isSafeInteger(numberValue) && numberValue > 0
    ? numberValue
    : null;
}

function parseCartItems(value: string): RawCartItem[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is RawCartItem =>
        typeof item === "object" &&
        item !== null &&
        (typeof item.id === "string" || typeof item.id === "number") &&
        (item.image === undefined || typeof item.image === "string")
    );
  } catch {
    return [];
  }
}

function getFirstImageFromArtwork(doc: Record<string, unknown>) {
  const gallery = Array.isArray(doc.gallery) ? doc.gallery : [];
  const first = gallery[0];

  if (typeof first === "object" && first !== null && "media" in first) {
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
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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

  const userId = numericId(user.id);
  if (userId === null) {
    throw new Error("Invalid user ID");
  }

  const rawCartItems = parseCartItems(cartJson);
  if (rawCartItems.length === 0) {
    redirect(`/${locale}/checkout?error=empty-cart`);
  }

  if (!customerName || !customerEmail) {
    redirect(`/${locale}/checkout?error=missing-fields`);
  }

  const payload = await getPayloadClient();
  const alreadyPurchasedIds = await getPaidArtworkIdsByUser(userId);
  const orderItems: OrderItem[] = [];
  const seen = new Set<number>();

  for (const item of rawCartItems) {
    if (!item.id) {
      continue;
    }

    const artworkId = numericId(item.id);
    if (
      artworkId === null ||
      seen.has(artworkId) ||
      alreadyPurchasedIds.includes(String(artworkId))
    ) {
      continue;
    }
    seen.add(artworkId);

    try {
      const artwork = await payload.findByID({
        collection: "artworks",
        id: artworkId,
        depth: 2,
      });

      const artworkData = artwork as unknown as Record<string, unknown>;
      // Check the current CMS state, never trust client-side cart data.
      if (
        artworkData.type !== "digital" ||
        artworkData.showInShop === false ||
        artworkData.isPurchasable === false ||
        artworkData.availability === "sold"
      ) {
        continue;
      }

      const price =
        typeof artworkData.price === "number" ? artworkData.price : 0;
      const currency = artworkData.currency === "USD" ? "USD" : "EUR";

      if (!Number.isFinite(price) || price <= 0) {
        continue;
      }

      orderItems.push({
        artwork: artworkId,
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
  if (orderItems.some((item) => item.currency !== currency)) {
    redirect(`/${locale}/checkout?error=mixed-currency`);
  }

  const total = orderItems.reduce((sum, item) => sum + item.price, 0);
  const order = await payload.create({
    collection: "orders",
    data: {
      user: userId,
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

  const orderId = String(order.id);
  const baseUrl = getBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: orderItems.map((item) => ({
      quantity: 1,
      price_data: {
        currency: item.currency.toLowerCase(),
        unit_amount: toStripeAmount(item.price),
        product_data: { name: item.title },
      },
    })),
    success_url: `${baseUrl}/${locale}/checkout/success?order=${orderId}`,
    cancel_url: `${baseUrl}/${locale}/checkout?cancelled=1`,
    metadata: { orderId, userId: String(userId) },
    payment_intent_data: {
      metadata: { orderId, userId: String(userId) },
    },
  });

  await payload.update({
    collection: "orders",
    id: order.id,
    data: { stripeSessionId: session.id },
    overrideAccess: true,
  });

  if (!session.url) {
    redirect(`/${locale}/checkout?error=stripe-session`);
  }

  redirect(session.url);
}
