import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentUser } from "@/lib/currentUser";
import { getPayloadClient } from "@/lib/payload";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ locale: string }>;
};

type Dictionary = Record<string, unknown>;

function isObject(value: unknown): value is Dictionary {
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

function toPayloadId(value: string): string | number {
  const numberValue = Number(value);
  return Number.isSafeInteger(numberValue) && value.trim() !== ""
    ? numberValue
    : value;
}

function denied() {
  return NextResponse.json(
    { error: "Download not available" },
    { status: 404, headers: { "Cache-Control": "no-store" } }
  );
}

async function readLocalUpload(filename: string, staticDir?: string) {
  // The existing project uses local Payload uploads in media/.
  // Do not use a client-supplied path or URL.
  const candidates = new Set<string>();

  if (staticDir) {
    if (path.isAbsolute(staticDir)) {
      candidates.add(staticDir);
    } else {
      candidates.add(path.resolve(process.cwd(), staticDir));
      candidates.add(path.resolve(process.cwd(), "src", staticDir));
    }
  }

  candidates.add(path.resolve(process.cwd(), "media"));
  candidates.add(path.resolve(process.cwd(), "src", "media"));

  for (const directory of candidates) {
    const fullPath = path.resolve(directory, filename);

    if (path.dirname(fullPath) !== path.resolve(directory)) {
      continue;
    }

    try {
      return await readFile(fullPath);
    } catch (error) {
      if (
        isObject(error) &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        continue;
      }
      throw error;
    }
  }

  return null;
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

  const orderId = request.nextUrl.searchParams.get("orderId");
  const artworkId = request.nextUrl.searchParams.get("artworkId");

  if (!orderId || !artworkId) {
    return denied();
  }

  const payload = await getPayloadClient();
  let order: Dictionary;

  try {
    const result = await payload.findByID({
      collection: "orders",
      id: toPayloadId(orderId),
      depth: 0,
      overrideAccess: true,
    });
    order = result as unknown as Dictionary;
  } catch {
    return denied();
  }

  const isOwner = getRelationId(order.user) === String(user.id);
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    return denied();
  }

  if (order.paymentStatus !== "paid" || order.status !== "completed") {
    return denied();
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const purchasedItem = items.find(
    (item) =>
      isObject(item) &&
      item.type === "digital" &&
      getRelationId(item.artwork) === artworkId
  );

  if (!purchasedItem) {
    return denied();
  }

  let artwork: Dictionary;
  try {
    const result = await payload.findByID({
      collection: "artworks",
      id: toPayloadId(artworkId),
      depth: 0,
      overrideAccess: true,
    });
    artwork = result as unknown as Dictionary;
  } catch {
    return denied();
  }

  if (artwork.type !== "digital") {
    return denied();
  }

  const digitalFileId = getRelationId(artwork.digitalFile);
  if (!digitalFileId) {
    return denied();
  }

  let media: Dictionary;
  try {
    const result = await payload.findByID({
      collection: "media",
      id: toPayloadId(digitalFileId),
      depth: 0,
      overrideAccess: true,
    });
    media = result as unknown as Dictionary;
  } catch {
    return denied();
  }

  // Explicitly fail closed until the migration has protected old originals.
  if (media.isProtected !== true) {
    console.error(`Paid original Media #${digitalFileId} is not protected`);
    return NextResponse.json(
      { error: "Digital file configuration is incomplete" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const filename = media.filename;
  if (
    typeof filename !== "string" ||
    filename.length === 0 ||
    filename === "." ||
    filename === ".." ||
    path.basename(filename) !== filename ||
    filename.includes("\\")
  ) {
    return denied();
  }

  const collectionConfig = payload.config.collections.find(
    (collection) => collection.slug === "media"
  );
  const uploadConfig = collectionConfig?.upload;
  const staticDir =
    uploadConfig &&
    typeof uploadConfig === "object" &&
    typeof uploadConfig.staticDir === "string"
      ? uploadConfig.staticDir
      : undefined;

  let file: Buffer | null;
  try {
    file = await readLocalUpload(filename, staticDir);
  } catch (error) {
    console.error("Could not read protected digital file:", error);
    return NextResponse.json(
      { error: "File temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!file) {
    return NextResponse.json(
      { error: "File not found in local storage" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  const mimeType =
    typeof media.mimeType === "string" &&
    /^[\w.+-]+\/[\w.+-]+$/.test(media.mimeType)
      ? media.mimeType
      : "application/octet-stream";

  return new NextResponse(new Uint8Array(file), {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(file.byteLength),
      "Content-Disposition": `attachment; filename="download"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
