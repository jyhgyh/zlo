import { getPayloadClient } from "@/lib/payload";
import { Artwork } from "@/types/artwork";
import { normalizeArtwork } from "@/lib/getArtworks";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getRelationId(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (isObject(value) && value.id) {
    return String(value.id);
  }

  return "";
}

export function normalizeRelationValue(value: string): string | number {
  const numberValue = Number(value);

  if (!Number.isNaN(numberValue) && value.trim() !== "") {
    return numberValue;
  }

  return value;
}

export async function getFavoriteIds(
  userId: string | number
): Promise<string[]> {
  const payload = await getPayloadClient();

  const user = await payload.findByID({
    collection: "users" as never,
    id: userId,
    depth: 0,
    overrideAccess: true,
  });

  const favorites = Array.isArray((user as Record<string, unknown>).favorites)
    ? ((user as Record<string, unknown>).favorites as unknown[])
    : [];

  return favorites
    .map((favorite) => getRelationId(favorite))
    .filter(Boolean);
}

export async function getFavoriteRelationValues(
  userId: string | number
): Promise<Array<string | number>> {
  const payload = await getPayloadClient();

  const user = await payload.findByID({
    collection: "users" as never,
    id: userId,
    depth: 0,
    overrideAccess: true,
  });

  const favorites = Array.isArray((user as Record<string, unknown>).favorites)
    ? ((user as Record<string, unknown>).favorites as unknown[])
    : [];

  return favorites
    .map((favorite) => {
      const id = getRelationId(favorite);

      if (!id) {
        return null;
      }

      return normalizeRelationValue(id);
    })
    .filter((favorite): favorite is string | number => favorite !== null);
}

export async function isArtworkFavorite(
  userId: string | number,
  artworkId: string | number
): Promise<boolean> {
  const favoriteIds = await getFavoriteIds(userId);

  return favoriteIds.includes(String(artworkId));
}

export async function getFavoriteArtworks(
  userId: string | number
): Promise<Artwork[]> {
  const payload = await getPayloadClient();

  const user = await payload.findByID({
    collection: "users" as never,
    id: userId,
    depth: 3,
    overrideAccess: true,
  });

  const favorites = Array.isArray((user as Record<string, unknown>).favorites)
    ? ((user as Record<string, unknown>).favorites as unknown[])
    : [];

  return favorites
    .filter((favorite) => isObject(favorite))
    .map((favorite) =>
      normalizeArtwork(favorite as Record<string, unknown>)
    );
}