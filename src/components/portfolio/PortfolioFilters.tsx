"use client";

import { useState } from "react";
import type { ReactNode } from "react";

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
  mode: "shop" | "portfolio";
  filters: PortfolioFilterState;
  options: PortfolioFilterOptions;
  onChange: (filters: PortfolioFilterState) => void;
  onClear: () => void;
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
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b pb-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between font-medium"
      >
        <span>{title}</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function formatLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function PortfolioFilters({
  mode,
  filters,
  options,
  onChange,
  onClear,
}: PortfolioFiltersProps) {
  const updateArrayFilter = (key: ArrayFilterKey, value: string) => {
    onChange({ ...filters, [key]: toggleValue(filters[key], value) });
  };

  const updateTextFilter = (key: "search" | "minPrice" | "maxPrice", value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const renderCheckboxes = (key: ArrayFilterKey, values: string[]) =>
    values.map((value) => (
      <label key={value} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters[key].includes(value)}
          onChange={() => updateArrayFilter(key, value)}
        />
        <span>{formatLabel(value)}</span>
      </label>
    ));

  return (
    <aside className="h-fit rounded-xl border p-5 lg:sticky lg:top-24">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button type="button" onClick={onClear} className="text-sm text-gray-500 hover:underline">
          Clear
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="artwork-search" className="mb-2 block text-sm text-gray-500">Search</label>
        <input
          id="artwork-search"
          type="search"
          list="artwork-search-suggestions"
          value={filters.search}
          onChange={(event) => updateTextFilter("search", event.target.value)}
          placeholder="Title, category, tag..."
          className="w-full rounded-lg border p-3"
        />
        <datalist id="artwork-search-suggestions">
          {options.searchSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      </div>

      <div className="space-y-5">
        <FilterSection title="Type" defaultOpen>
          {renderCheckboxes("types", ["physical", "digital"])}
        </FilterSection>

        {mode === "shop" && (
          <>
            <FilterSection title="Price">
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(event) => updateTextFilter("minPrice", event.target.value)}
                placeholder="Min"
                aria-label="Minimum price"
                className="w-full rounded border p-2"
              />
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(event) => updateTextFilter("maxPrice", event.target.value)}
                placeholder="Max"
                aria-label="Maximum price"
                className="w-full rounded border p-2"
              />
            </FilterSection>
          </>
        )}

        {options.categories.length > 0 && (
          <FilterSection title="Category">
            {renderCheckboxes("categories", options.categories)}
          </FilterSection>
        )}
        {options.sizeCategories.length > 0 && (
          <FilterSection title="Size">
            {renderCheckboxes("sizeCategories", options.sizeCategories)}
          </FilterSection>
        )}
        {options.materials.length > 0 && (
          <FilterSection title="Material">
            {renderCheckboxes("materials", options.materials)}
          </FilterSection>
        )}
        {options.surfaces.length > 0 && (
          <FilterSection title="Surface">
            {renderCheckboxes("surfaces", options.surfaces)}
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
                    aria-pressed={active}
                    onClick={() => updateArrayFilter("tags", tag)}
                    className={`rounded border px-2 py-1 text-sm transition hover:bg-gray-100 ${active ? "bg-gray-100" : ""}`}
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
