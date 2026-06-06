"use client";

import { useMemo, useState } from "react";
import ArtworkCard from "@/components/portfolio/ArtworkCard";
import PortfolioFilters, {
  PortfolioFilterState,
} from "@/components/portfolio/PortfolioFilters";
import { Artwork } from "@/types/artwork";

type PortfolioClientProps = {
  artworks: Artwork[];
  locale: string;
};

const defaultFilters: PortfolioFilterState = {
  search: "",
  types: [],
  categories: [],
  availability: [],
  sizeCategories: [],
  materials: [],
  surfaces: [],
  tags: [],
  minPrice: "",
  maxPrice: "",
};

function getUnique(values: Array<string | undefined>) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b));
}

function matchesSelectedValue(
  selected: string[],
  value?: string
) {
  if (selected.length === 0) {
    return true;
  }

  if (!value) {
    return false;
  }

  return selected.includes(value);
}

function matchesSelectedArray(
  selected: string[],
  values: string[]
) {
  if (selected.length === 0) {
    return true;
  }

  return values.some((value) => selected.includes(value));
}

function getSearchableText(artwork: Artwork) {
  return [
    artwork.title,
    artwork.category,
    ...artwork.categories,
    ...artwork.tags,
    artwork.material,
    artwork.surface,
    artwork.medium,
    artwork.type,
    artwork.availability,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function PortfolioClient({
  artworks,
  locale,
}: PortfolioClientProps) {
  const [filters, setFilters] =
    useState<PortfolioFilterState>(defaultFilters);

  const options = useMemo(() => {
    const categories = getUnique(
      artworks.flatMap((artwork) =>
        artwork.categories.length > 0
          ? artwork.categories
          : [artwork.category]
      )
    );

    const tags = getUnique(
      artworks.flatMap((artwork) => artwork.tags)
    );

    const materials = getUnique(
      artworks.map((artwork) => artwork.material)
    );

    const surfaces = getUnique(
      artworks.map((artwork) => artwork.surface)
    );

    const sizeCategories = getUnique(
      artworks.map((artwork) => artwork.sizeCategory)
    );

    const searchSuggestions = getUnique(
      artworks.flatMap((artwork) => [
        artwork.title,
        artwork.category,
        ...artwork.categories,
        ...artwork.tags,
        artwork.material,
        artwork.surface,
        artwork.medium,
      ])
    );

    return {
      categories,
      tags,
      materials,
      surfaces,
      sizeCategories,
      searchSuggestions,
    };
  }, [artworks]);

  const filteredArtworks = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    const minPrice =
      filters.minPrice.trim() !== ""
        ? Number(filters.minPrice)
        : null;

    const maxPrice =
      filters.maxPrice.trim() !== ""
        ? Number(filters.maxPrice)
        : null;

    return artworks.filter((artwork) => {
      const matchesSearch =
        search === "" ||
        getSearchableText(artwork).includes(search);

      const matchesType = matchesSelectedValue(
        filters.types,
        artwork.type
      );

      const matchesCategory = matchesSelectedArray(
        filters.categories,
        artwork.categories.length > 0
          ? artwork.categories
          : [artwork.category]
      );

      const matchesAvailability = matchesSelectedValue(
        filters.availability,
        artwork.availability
      );

      const matchesSize = matchesSelectedValue(
        filters.sizeCategories,
        artwork.sizeCategory
      );

      const matchesMaterial = matchesSelectedValue(
        filters.materials,
        artwork.material
      );

      const matchesSurface = matchesSelectedValue(
        filters.surfaces,
        artwork.surface
      );

      const matchesTags = matchesSelectedArray(
        filters.tags,
        artwork.tags
      );

      const matchesMinPrice =
        minPrice === null ||
        Number.isNaN(minPrice) ||
        artwork.price >= minPrice;

      const matchesMaxPrice =
        maxPrice === null ||
        Number.isNaN(maxPrice) ||
        artwork.price <= maxPrice;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesAvailability &&
        matchesSize &&
        matchesMaterial &&
        matchesSurface &&
        matchesTags &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [artworks, filters]);

  function clearFilters() {
    setFilters(defaultFilters);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <PortfolioFilters
        filters={filters}
        options={options}
        onChange={setFilters}
        onClear={clearFilters}
      />

      <div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {filteredArtworks.length} artwork
            {filteredArtworks.length === 1 ? "" : "s"} found
          </p>

          {(filters.search ||
            filters.types.length > 0 ||
            filters.categories.length > 0 ||
            filters.availability.length > 0 ||
            filters.sizeCategories.length > 0 ||
            filters.materials.length > 0 ||
            filters.surfaces.length > 0 ||
            filters.tags.length > 0 ||
            filters.minPrice ||
            filters.maxPrice) && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-100"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredArtworks.length > 0 ? (
          <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
            {filteredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="mb-6 break-inside-avoid"
              >
                <ArtworkCard
                  artwork={artwork}
                  locale={locale}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No artworks found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing the search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}