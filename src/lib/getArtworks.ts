import { getPayloadClient } from "@/lib/payload";
import type { Artwork, ArtworkMedia } from "@/types/artwork";

type PayloadMedia = {
  id?: string | number;
  url?: string;
  alt?: string;
  mediaType?: "image" | "video" | "archive";
};

type PayloadTitleItem = {
  title?: string;
  name?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeMedia(media: unknown): ArtworkMedia | null {
  if (!isObject(media)) return null;
  const mediaData = media as PayloadMedia;
  if (!mediaData.url) return null;

  return {
    id: mediaData.id ?? mediaData.url,
    url: mediaData.url,
    alt: mediaData.alt ?? "Artwork image",
    mediaType: mediaData.mediaType,
  };
}

function normalizeTitleItems(items: unknown): string[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!isObject(item)) return null;
      const data = item as PayloadTitleItem;
      return data.title ?? data.name ?? null;
    })
    .filter((item): item is string => Boolean(item));
}

export function normalizeArtwork(doc: Record<string, unknown>): Artwork {
  const galleryRows = Array.isArray(doc.gallery) ? doc.gallery : [];
  const gallery = galleryRows
    .map((row) => (isObject(row) ? normalizeMedia(row.media) : null))
    .filter((item): item is ArtworkMedia => Boolean(item));

  const videos = Array.isArray(doc.videos)
    ? doc.videos
        .map((video) => normalizeMedia(video))
        .filter((item): item is ArtworkMedia => Boolean(item))
    : [];

  const categories = normalizeTitleItems(doc.categories);
  const tags = normalizeTitleItems(doc.tags);

  return {
    id: String(doc.id),
    title: String(doc.title ?? "Untitled artwork"),
    slug: String(doc.slug ?? ""),
    shortDescription:
      typeof doc.shortDescription === "string" ? doc.shortDescription : undefined,
    description: typeof doc.description === "string" ? doc.description : undefined,
    image: gallery[0]?.url ?? "",
    gallery,
    videos,
    type: doc.type === "digital" ? "digital" : "physical",
    price: typeof doc.price === "number" ? doc.price : 0,
    currency: doc.currency === "USD" ? "USD" : "EUR",
    category: categories[0] ?? "Uncategorized",
    categories,
    tags,
    featured: typeof doc.featured === "boolean" ? doc.featured : false,
    showInShop: doc.showInShop !== false,
    showInPortfolio: doc.showInPortfolio === true,
    isPurchasable: doc.isPurchasable !== false,
    year: typeof doc.year === "number" ? doc.year : undefined,
    orientation:
      doc.orientation === "portrait" || doc.orientation === "landscape"
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
    medium: typeof doc.medium === "string" ? doc.medium : undefined,
    widthCm: typeof doc.widthCm === "number" ? doc.widthCm : undefined,
    heightCm: typeof doc.heightCm === "number" ? doc.heightCm : undefined,
    widthPx: typeof doc.widthPx === "number" ? doc.widthPx : undefined,
    heightPx: typeof doc.heightPx === "number" ? doc.heightPx : undefined,
    availability: doc.availability === "sold" ? "sold" : "available",
  };
}

export async function getArtworks(): Promise<Artwork[]> {
  const payload = await getPayloadClient();
  const all: Artwork[] = [];
  let page = 1;

  // Fetch all pages; otherwise catalog entries after the first 100 disappear.
  while (true) {
    const result = await payload.find({
      collection: "artworks",
      depth: 2,
      limit: 100,
      page,
      sort: "-createdAt",
    });
    all.push(
      ...result.docs.map((doc) => normalizeArtwork(doc as unknown as Record<string, unknown>))
    );
    if (!result.hasNextPage) break;
    page++;
  }

  return all;
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "artworks",
    depth: 2,
    limit: 1,
    where: { slug: { equals: slug } },
  });

  const doc = result.docs[0];
  return doc ? normalizeArtwork(doc as unknown as Record<string, unknown>) : null;
}
