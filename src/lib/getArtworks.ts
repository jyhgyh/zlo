import { getPayloadClient } from "@/lib/payload";
import { Artwork, ArtworkMedia } from "@/types/artwork";

type PayloadMedia = {
  id?: string | number;
  url?: string;
  alt?: string;
  mediaType?: "image" | "video";
};

type PayloadTitleItem = {
  title?: string;
  name?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeMedia(media: unknown): ArtworkMedia | null {
  if (!isObject(media)) {
    return null;
  }

  const mediaData = media as PayloadMedia;

  if (!mediaData.url) {
    return null;
  }

  return {
    id: mediaData.id ?? mediaData.url,
    url: mediaData.url,
    alt: mediaData.alt ?? "Artwork image",
    mediaType: mediaData.mediaType,
  };
}

function normalizeTitleItems(items: unknown): string[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (!isObject(item)) {
        return null;
      }

      const data = item as PayloadTitleItem;

      return data.title ?? data.name ?? null;
    })
    .filter((item): item is string => Boolean(item));
}

function normalizeArtwork(doc: Record<string, unknown>): Artwork {
  const galleryRows = Array.isArray(doc.gallery)
    ? doc.gallery
    : [];

  const gallery = galleryRows
    .map((row) => {
      if (!isObject(row)) {
        return null;
      }

      return normalizeMedia(row.media);
    })
    .filter((item): item is ArtworkMedia => Boolean(item));

  const videos = Array.isArray(doc.videos)
    ? doc.videos
        .map((video) => normalizeMedia(video))
        .filter((item): item is ArtworkMedia => Boolean(item))
    : [];

  const categories = normalizeTitleItems(doc.categories);
  const tags = normalizeTitleItems(doc.tags);

  const firstImage = gallery[0]?.url ?? "";

  return {
    id: String(doc.id),

    title: String(doc.title ?? "Untitled artwork"),
    slug: String(doc.slug ?? ""),

    shortDescription:
      typeof doc.shortDescription === "string"
        ? doc.shortDescription
        : undefined,

    description:
      typeof doc.description === "string"
        ? doc.description
        : undefined,

    image: firstImage,
    gallery,
    videos,

    type:
      doc.type === "digital"
        ? "digital"
        : "physical",

    price:
      typeof doc.price === "number"
        ? doc.price
        : 0,

    currency:
      doc.currency === "USD"
        ? "USD"
        : "EUR",

    category: categories[0] ?? "Uncategorized",
    categories,

    tags,

    featured:
      typeof doc.featured === "boolean"
        ? doc.featured
        : false,

    year:
      typeof doc.year === "number"
        ? doc.year
        : undefined,

    orientation:
      doc.orientation === "portrait" ||
      doc.orientation === "landscape"
        ? doc.orientation
        : undefined,

    sizeCategory:
      doc.sizeCategory === "small" ||
      doc.sizeCategory === "medium" ||
      doc.sizeCategory === "large"
        ? doc.sizeCategory
        : undefined,

    material:
      doc.material === "acrylic" ||
      doc.material === "oil" ||
      doc.material === "watercolor"
        ? doc.material
        : undefined,

    surface:
      doc.surface === "canvas" ||
      doc.surface === "paper" ||
      doc.surface === "glass"
        ? doc.surface
        : undefined,

    medium:
      typeof doc.medium === "string"
        ? doc.medium
        : undefined,

    widthCm:
      typeof doc.widthCm === "number"
        ? doc.widthCm
        : undefined,

    heightCm:
      typeof doc.heightCm === "number"
        ? doc.heightCm
        : undefined,

    widthPx:
      typeof doc.widthPx === "number"
        ? doc.widthPx
        : undefined,

    heightPx:
      typeof doc.heightPx === "number"
        ? doc.heightPx
        : undefined,

    availability:
      doc.availability === "sold"
        ? "sold"
        : "available",
  };
}

export async function getArtworks(): Promise<Artwork[]> {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "artworks" as never,
    depth: 2,
    limit: 100,
    sort: "-createdAt",
  });

  return result.docs.map((doc) =>
    normalizeArtwork(doc as Record<string, unknown>)
  );
}

export async function getArtworkBySlug(
  slug: string
): Promise<Artwork | null> {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "artworks" as never,
    depth: 2,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  const doc = result.docs[0];

  if (!doc) {
    return null;
  }

  return normalizeArtwork(doc as Record<string, unknown>);
}