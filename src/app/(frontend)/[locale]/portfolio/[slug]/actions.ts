"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import {
  getFavoriteIds,
  getFavoriteRelationValues,
} from "@/lib/favorites";
import { getPayloadClient } from "@/lib/payload";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function numericId(value: string | number): number | null {
  const num = Number(value);
  return Number.isSafeInteger(num) && num > 0 ? num : null;
}

export async function toggleFavorite(formData: FormData) {
  const locale = getFormValue(formData, "locale") || "en";
  const slug = getFormValue(formData, "slug");
  const source = getFormValue(formData, "source") === "shop"
    ? "shop"
    : "portfolio";
  const artworkId = getFormValue(formData, "artworkId");

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  const userId = numericId(user.id);
  const favoriteArtworkId = numericId(artworkId);
  if (userId === null || favoriteArtworkId === null) {
    redirect(`/${locale}/${source}/${slug}`);
  }

  const payload = await getPayloadClient();
  const favoriteIds = await getFavoriteIds(userId);
  const favoriteValues = await getFavoriteRelationValues(userId);
  const isAlreadyFavorite = favoriteIds.includes(String(favoriteArtworkId));

  const nextFavorites = isAlreadyFavorite
    ? favoriteValues.filter((favorite) => Number(favorite) !== favoriteArtworkId)
    : [...favoriteValues, favoriteArtworkId];

  const numericFavorites = Array.from(
    new Set(
      nextFavorites
        .map(Number)
        .filter((value) => Number.isSafeInteger(value) && value > 0)
    )
  );

  await payload.update({
    collection: "users",
    id: userId,
    data: { favorites: numericFavorites },
    overrideAccess: true,
  });

  redirect(`/${locale}/${source}/${slug}`);
}
