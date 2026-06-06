"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { UserDownload } from "@/lib/downloads";

type DownloadsClientProps = {
  downloads: UserDownload[];
  locale: string;
};

type TypeFilter = "all" | "physical" | "digital";

function getCurrencySymbol(currency: "EUR" | "USD") {
  return currency === "USD" ? "$" : "€";
}

function getUnique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

export default function DownloadsClient({
  downloads,
  locale,
}: DownloadsClientProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>("all");

  const searchSuggestions = useMemo(() => {
    return getUnique(downloads.map((item) => item.title));
  }, [downloads]);

  const filteredDownloads = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return downloads.filter((item) => {
      const matchesSearch =
        normalizedSearch === "" ||
        item.title.toLowerCase().includes(normalizedSearch);

      const matchesType =
        typeFilter === "all" ||
        item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [downloads, search, typeFilter]);

  if (downloads.length === 0) {
    return (
      <div className="rounded-xl border p-10 text-center">
        <h2 className="text-2xl font-semibold">
          No downloads yet
        </h2>

        <p className="mt-2 text-gray-500">
          Purchased digital artworks will appear here.
        </p>

        <Link
          href={`/${locale}/portfolio`}
          className="mt-6 inline-block rounded-xl border px-6 py-3 transition hover:bg-gray-100"
        >
          Browse portfolio
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 grid gap-4 rounded-xl border p-4 md:grid-cols-[1fr_220px]">
        <div>
          <label className="mb-2 block text-sm text-gray-500">
            Search downloads
          </label>

          <input
            type="search"
            list="downloads-search-suggestions"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Start typing title..."
            className="w-full rounded-lg border p-3"
          />

          <datalist id="downloads-search-suggestions">
            {searchSuggestions.map((suggestion) => (
              <option
                key={suggestion}
                value={suggestion}
              />
            ))}
          </datalist>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-500">
            Type
          </label>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value as TypeFilter)
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="all">All types</option>
            <option value="digital">Digital</option>
            <option value="physical">Physical</option>
          </select>
        </div>
      </div>

      {filteredDownloads.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDownloads.map((item) => (
            <div
              key={`${item.orderId}-${item.artworkId}`}
              className="overflow-hidden rounded-xl border"
            >
              <div className="aspect-[4/3] bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    Image
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <Link
                    href={`/${locale}/portfolio/${item.slug}`}
                    className="text-lg font-semibold hover:underline"
                  >
                    {item.title}
                  </Link>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.type} artwork
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Order #{item.orderId}
                  </span>

                  <span>
                    {getCurrencySymbol(item.currency)}
                    {item.price}
                  </span>
                </div>

                {item.purchasedAt && (
                  <p className="text-sm text-gray-500">
                    Purchased on{" "}
                    {new Date(item.purchasedAt).toLocaleDateString()}
                  </p>
                )}

                <a
                  href={`/${locale}/account/orders/download?orderId=${item.orderId}&artworkId=${item.artworkId}`}
                  className="block w-full rounded-xl border px-5 py-3 text-center font-medium transition hover:bg-gray-100"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No matching downloads
          </h2>

          <p className="mt-2 text-gray-500">
            Try changing the search or type filter.
          </p>
        </div>
      )}
    </div>
  );
}