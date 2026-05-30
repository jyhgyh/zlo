"use client";

import { useState } from "react";

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
};

function FilterSection({
  title,
  children,
}: FilterSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between font-medium"
      >
        <span>{title}</span>
        <span>{open ? "-" : "+"}</span>
      </button>

      {open && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function PortfolioFilters() {
  return (
    <aside
      className="
        sticky
        top-6
        h-[calc(100vh-3rem)]
        overflow-y-auto
        rounded-xl
        border
        p-5
      "
    >
      <h2 className="mb-6 text-xl font-semibold">
        Filters
      </h2>

      <div className="space-y-5">
        <FilterSection title="Type">
          <label className="block">
            <input type="checkbox" /> Physical
          </label>

          <label className="block">
            <input type="checkbox" /> Digital
          </label>
        </FilterSection>

        <FilterSection title="Price">
          <input
            placeholder="Min"
            className="mb-2 w-full rounded border p-2"
          />

          <input
            placeholder="Max"
            className="w-full rounded border p-2"
          />
        </FilterSection>

        <FilterSection title="Size">
          <label className="block">
            <input type="checkbox" /> Small
          </label>

          <label className="block">
            <input type="checkbox" /> Medium
          </label>

          <label className="block">
            <input type="checkbox" /> Large
          </label>
        </FilterSection>

        <FilterSection title="Material">
          <label className="block">
            <input type="checkbox" /> Acrylic
          </label>

          <label className="block">
            <input type="checkbox" /> Oil
          </label>

          <label className="block">
            <input type="checkbox" /> Watercolor
          </label>
        </FilterSection>

        <FilterSection title="Surface">
          <label className="block">
            <input type="checkbox" /> Canvas
          </label>

          <label className="block">
            <input type="checkbox" /> Paper
          </label>

          <label className="block">
            <input type="checkbox" /> Glass
          </label>
        </FilterSection>

        <FilterSection title="Tags">
          <div className="flex flex-wrap gap-2">
            <span className="rounded border px-2 py-1">
              Space
            </span>

            <span className="rounded border px-2 py-1">
              Sea
            </span>

            <span className="rounded border px-2 py-1">
              Houses
            </span>

            <span className="rounded border px-2 py-1">
              Nature
            </span>

            <span className="rounded border px-2 py-1">
              Portrait
            </span>
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}