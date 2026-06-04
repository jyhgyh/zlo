import { getCurrentUser } from "@/lib/currentUser";
import { getPayloadClient } from "@/lib/payload";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    locale: string;
  }>;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getRelationId(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (isObject(value)) {
    const id = value.id;

    if (typeof id === "string" || typeof id === "number") {
      return String(id);
    }
  }

  return "";
}

function getMediaUrl(value: unknown): string {
  if (!isObject(value)) {
    return "";
  }

  const url = value.url;

  if (typeof url !== "string") {
    return "";
  }

  return url;
}

function toPayloadId(value: string): string | number {
  const numberValue = Number(value);

  if (!Number.isNaN(numberValue) && value.trim() !== "") {
    return numberValue;
  }

  return value;
}

async function getDigitalFileUrl(digitalFile: unknown) {
  const directUrl = getMediaUrl(digitalFile);

  if (directUrl) {
    return directUrl;
  }

  const mediaId = getRelationId(digitalFile);

  if (!mediaId) {
    return "";
  }

  const payload = await getPayloadClient();

  const media = await payload.findByID({
    collection: "media" as never,
    id: toPayloadId(mediaId),
    depth: 0,
    overrideAccess: true,
  });

  return getMediaUrl(media);
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const { locale } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(
      new URL(`/${locale}/login`, request.url)
    );
  }

  const searchParams = request.nextUrl.searchParams;

  const orderId = searchParams.get("orderId");
  const artworkId = searchParams.get("artworkId");

  if (!orderId || !artworkId) {
    return NextResponse.redirect(
      new URL(`/${locale}/account/orders`, request.url)
    );
  }

  const payload = await getPayloadClient();

  const order = await payload.findByID({
    collection: "orders" as never,
    id: toPayloadId(orderId),
    depth: 3,
    overrideAccess: true,
  });

  const orderData = order as Record<string, unknown>;

  const orderUserId = getRelationId(orderData.user);

  const isOwner = orderUserId === String(user.id);
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    return NextResponse.redirect(
      new URL(`/${locale}/account/orders`, request.url)
    );
  }

  if (orderData.paymentStatus !== "paid") {
    return NextResponse.redirect(
      new URL(`/${locale}/account/orders`, request.url)
    );
  }

  const items = Array.isArray(orderData.items)
    ? orderData.items
    : [];

  const orderItem = items.find((item) => {
    if (!isObject(item)) {
      return false;
    }

    return getRelationId(item.artwork) === String(artworkId);
  });

  if (!isObject(orderItem)) {
    return NextResponse.redirect(
      new URL(`/${locale}/account/orders`, request.url)
    );
  }

  let artworkData: Record<string, unknown> | null = null;

  if (isObject(orderItem.artwork)) {
    artworkData = orderItem.artwork;
  } else {
    const artwork = await payload.findByID({
      collection: "artworks" as never,
      id: toPayloadId(artworkId),
      depth: 3,
      overrideAccess: true,
    });

    artworkData = artwork as Record<string, unknown>;
  }

  const digitalFileUrl = await getDigitalFileUrl(
    artworkData.digitalFile
  );

  if (!digitalFileUrl) {
    return NextResponse.redirect(
      new URL(`/${locale}/account/orders`, request.url)
    );
  }

  return NextResponse.redirect(
    new URL(digitalFileUrl, request.url)
  );
}