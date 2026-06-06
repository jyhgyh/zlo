"use client";

import { useState } from "react";

export type PortfolioFilterState = {
  search: string;
  types: string[];
  categories: string[];
  availability: string[];
  sizeCategories: string[];
  materials: string[];
  surfaces: string[];
  tags: string[];
  minPrice: string;
  maxPrice: string;
};

type PortfolioFilterOptions = {
  categories: string[];
  tags: string[];
  materials: string[];
  surfaces: string[];
  sizeCategories: string[];
  searchSuggestions: string[];
};

type PortfolioFiltersProps = {
  filters: PortfolioFilterState;
  options: PortfolioFilterOptions;
  onChange: (filters: PortfolioFilterState) => void;
  onClear: () => void;
};

type FilterSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

type ArrayFilterKey =
  | "types"
  | "categories"
  | "availability"
  | "sizeCategories"
  | "materials"
  | "surfaces"
  | "tags";

function FilterSection({
  title,
  defaultOpen = false,
  children,
}: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b pb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between font-medium"
      >
        <span>{title}</span>
        <span>{open ? "-" : "+"}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

function toggleValue(values: string[], value: string) {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }

  return [...values, value];
}

function formatLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function PortfolioFilters({
  filters,
  options,
  onChange,
  onClear,
}: PortfolioFiltersProps) {
  function updateArrayFilter(
    key: ArrayFilterKey,
    value: string
  ) {
    onChange({
      ...filters,
      [key]: toggleValue(filters[key], value),
    });
  }

  function updateTextFilter(
    key: "search" | "minPrice" | "maxPrice",
    value: string
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <aside className="h-fit rounded-xl border p-5 lg:sticky lg:top-24">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">
          Filters
        </h2>

        <button
          type="button"
          onClick={onClear}
          className="text-sm text-gray-500 hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm text-gray-500">
          Search
        </label>

        <input
          type="search"
          list="portfolio-search-suggestions"
          value={filters.search}
          onChange={(event) =>
            updateTextFilter("search", event.target.value)
          }
          placeholder="Title, category, tag..."
          className="w-full rounded-lg border p-3"
        />

        <datalist id="portfolio-search-suggestions">
          {options.searchSuggestions.map((suggestion) => (
            <option
              key={suggestion}
              value={suggestion}
            />
          ))}
        </datalist>

        <p className="mt-2 text-xs text-gray-400">
          Start typing to see suggestions.
        </p>
      </div>

      <div className="space-y-5">
        <FilterSection title="Type" defaultOpen>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.types.includes("physical")}
              onChange={() =>
                updateArrayFilter("types", "physical")
              }
            />
            <span>Physical</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.types.includes("digital")}
              onChange={() =>
                updateArrayFilter("types", "digital")
              }
            />
            <span>Digital</span>
          </label>
        </FilterSection>

        <FilterSection title="Availability">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.availability.includes("available")}
              onChange={() =>
                updateArrayFilter("availability", "available")
              }
            />
            <span>Available</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.availability.includes("sold")}
              onChange={() =>
                updateArrayFilter("availability", "sold")
              }
            />
            <span>Sold</span>
          </label>
        </FilterSection>

        <FilterSection title="Price">
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(event) =>
              updateTextFilter("minPrice", event.target.value)
            }
            placeholder="Min"
            className="w-full rounded border p-2"
          />

          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(event) =>
              updateTextFilter("maxPrice", event.target.value)
            }
            placeholder="Max"
            className="w-full rounded border p-2"
          />
        </FilterSection>

        {options.categories.length > 0 && (
          <FilterSection title="Category">
            {options.categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() =>
                    updateArrayFilter("categories", category)
                  }
                />
                <span>{category}</span>
              </label>
            ))}
          </FilterSection>
        )}

        {options.sizeCategories.length > 0 && (
          <FilterSection title="Size">
            {options.sizeCategories.map((size) => (
              <label
                key={size}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={filters.sizeCategories.includes(size)}
                  onChange={() =>
                    updateArrayFilter("sizeCategories", size)
                  }
                />
                <span>{formatLabel(size)}</span>
              </label>
            ))}
          </FilterSection>
        )}

        {options.materials.length > 0 && (
          <FilterSection title="Material">
            {options.materials.map((material) => (
              <label
                key={material}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={filters.materials.includes(material)}
                  onChange={() =>
                    updateArrayFilter("materials", material)
                  }
                />
                <span>{formatLabel(material)}</span>
              </label>
            ))}
          </FilterSection>
        )}

        {options.surfaces.length > 0 && (
          <FilterSection title="Surface">
            {options.surfaces.map((surface) => (
              <label
                key={surface}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={filters.surfaces.includes(surface)}
                  onChange={() =>
                    updateArrayFilter("surfaces", surface)
                  }
                />
                <span>{formatLabel(surface)}</span>
              </label>
            ))}
          </FilterSection>
        )}

        {options.tags.length > 0 && (
          <FilterSection title="Tags">
            <div className="flex flex-wrap gap-2">
              {options.tags.map((tag) => {
                const active = filters.tags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      updateArrayFilter("tags", tag)
                    }
                    className={`rounded border px-2 py-1 text-sm transition hover:bg-gray-100 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        )}
      </div>
    </aside>
  );
}