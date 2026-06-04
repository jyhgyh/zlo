"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { getPayloadClient } from "@/lib/payload";

type RawCartItem = {
  id?: string;
  image?: string;
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

  const orderItems = [];

  for (const item of rawCartItems) {
    if (!item.id) {
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
    redirect(`/${locale}/checkout?error=invalid-cart`);
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

  redirect(`/${locale}/checkout/success?order=${orderId}`);
}