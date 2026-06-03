"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import {
  getFavoriteIds,
  getFavoriteRelationValues,
  normalizeRelationValue,
} from "@/lib/favorites";
import { getPayloadClient } from "@/lib/payload";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function toggleFavorite(formData: FormData) {
  const locale = getFormValue(formData, "locale") || "en";
  const slug = getFormValue(formData, "slug");
  const artworkId = getFormValue(formData, "artworkId");

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const payload = await getPayloadClient();

  const favoriteIds = await getFavoriteIds(user.id);
  const favoriteValues = await getFavoriteRelationValues(user.id);

  const isAlreadyFavorite = favoriteIds.includes(artworkId);

  const nextFavorites = isAlreadyFavorite
    ? favoriteValues.filter(
        (favorite) => String(favorite) !== artworkId
      )
    : [
        ...favoriteValues,
        normalizeRelationValue(artworkId),
      ];

  await payload.update({
    collection: "users" as never,
    id: user.id,
    data: {
      favorites: nextFavorites,
    },
    overrideAccess: true,
  });

  redirect(`/${locale}/portfolio/${slug}`);
}