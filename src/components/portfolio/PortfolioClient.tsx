"use client";

import { useMemo, useState } from "react";
import ArtworkCard from "@/components/portfolio/ArtworkCard";
import PortfolioFilters, {
  type PortfolioFilterState,
} from "@/components/portfolio/PortfolioFilters";
import type { Artwork } from "@/types/artwork";

type PortfolioClientProps = {
  artworks: Artwork[];
  locale: string;
  mode: "portfolio" | "shop";
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

function getUnique(values: Array<string | undefined>): string[] {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b));
}

function matchesSelectedValue(selected: string[], value?: string): boolean {
  return selected.length === 0 || (value !== undefined && selected.includes(value));
}

function matchesSelectedArray(selected: string[], values: string[]): boolean {
  return selected.length === 0 || values.some((value) => selected.includes(value));
}

function getSearchableText(artwork: Artwork): string {
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
    .toLocaleLowerCase();
}

export default function PortfolioClient({
  artworks,
  locale,
  mode,
}: PortfolioClientProps) {
  const [filters, setFilters] = useState<PortfolioFilterState>(defaultFilters);

  const options = useMemo(() => {
    const categories = getUnique(
      artworks.flatMap((artwork) =>
        artwork.categories.length > 0 ? artwork.categories : [artwork.category]
      )
    );
    const tags = getUnique(artworks.flatMap((artwork) => artwork.tags));
    const materials = getUnique(artworks.map((artwork) => artwork.material));
    const surfaces = getUnique(artworks.map((artwork) => artwork.surface));
    const sizeCategories = getUnique(artworks.map((artwork) => artwork.sizeCategory));
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

    return { categories, tags, materials, surfaces, sizeCategories, searchSuggestions };
  }, [artworks]);

  const filteredArtworks = useMemo(() => {
    const search = filters.search.trim().toLocaleLowerCase();
    const minPrice = filters.minPrice.trim() !== "" ? Number(filters.minPrice) : null;
    const maxPrice = filters.maxPrice.trim() !== "" ? Number(filters.maxPrice) : null;

    return artworks.filter((artwork) => {
      const categories = artwork.categories.length > 0
        ? artwork.categories
        : [artwork.category];

      return (
        (search === "" || getSearchableText(artwork).includes(search)) &&
        matchesSelectedValue(filters.types, artwork.type) &&
        matchesSelectedArray(filters.categories, categories) &&
        (mode !== "shop" || matchesSelectedValue(filters.availability, artwork.availability)) &&
        matchesSelectedValue(filters.sizeCategories, artwork.sizeCategory) &&
        matchesSelectedValue(filters.materials, artwork.material) &&
        matchesSelectedValue(filters.surfaces, artwork.surface) &&
        matchesSelectedArray(filters.tags, artwork.tags) &&
        (mode !== "shop" || minPrice === null || Number.isNaN(minPrice) || artwork.price >= minPrice) &&
        (mode !== "shop" || maxPrice === null || Number.isNaN(maxPrice) || artwork.price <= maxPrice)
      );
    });
  }, [artworks, filters, mode]);

  const hasFilters =
    filters.search !== "" ||
    filters.types.length > 0 ||
    filters.categories.length > 0 ||
    filters.availability.length > 0 ||
    filters.sizeCategories.length > 0 ||
    filters.materials.length > 0 ||
    filters.surfaces.length > 0 ||
    filters.tags.length > 0 ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "";

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <PortfolioFilters
        mode={mode}
        filters={filters}
        options={options}
        onChange={setFilters}
        onClear={() => setFilters({ ...defaultFilters })}
      />

      <div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {filteredArtworks.length} artwork{filteredArtworks.length === 1 ? "" : "s"} found
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => setFilters({ ...defaultFilters })}
              className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-100"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredArtworks.length > 0 ? (
          <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
            {filteredArtworks.map((artwork) => (
              <div key={artwork.id} className="mb-6 break-inside-avoid">
                <ArtworkCard artwork={artwork} locale={locale} mode={mode} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border p-10 text-center">
            <h2 className="text-2xl font-semibold">No artworks found</h2>
            <p className="mt-2 text-gray-500">Try changing the search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
