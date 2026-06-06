"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { UserOrder } from "@/lib/orders";

type OrdersClientProps = {
  orders: UserOrder[];
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

export default function OrdersClient({
  orders,
  locale,
}: OrdersClientProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>("all");

  const searchSuggestions = useMemo(() => {
    return getUnique(
      orders.flatMap((order) =>
        order.items.map((item) => item.title)
      )
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders
      .map((order) => {
        const items = order.items.filter((item) => {
          const matchesSearch =
            normalizedSearch === "" ||
            item.title
              .toLowerCase()
              .includes(normalizedSearch);

          const matchesType =
            typeFilter === "all" ||
            item.type === typeFilter;

          return matchesSearch && matchesType;
        });

        return {
          ...order,
          items,
        };
      })
      .filter((order) => order.items.length > 0);
  }, [orders, search, typeFilter]);

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border p-10 text-center">
        <h2 className="text-2xl font-semibold">
          No orders yet
        </h2>

        <p className="mt-2 text-gray-500">
          Your orders will appear here after checkout.
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
            Search purchased artworks
          </label>

          <input
            type="search"
            list="orders-search-suggestions"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Start typing title..."
            className="w-full rounded-lg border p-3"
          />

          <datalist id="orders-search-suggestions">
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

      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Order #{order.id}
                  </h2>

                  {order.createdAt && (
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {getCurrencySymbol(order.currency)}
                    {order.total}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.status} / {order.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.slug}-${item.artworkId}`}
                    className="grid gap-4 md:grid-cols-[80px_1fr_auto]"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          Image
                        </div>
                      )}
                    </div>

                    <div>
                      <Link
                        href={`/${locale}/portfolio/${item.slug}`}
                        className="font-medium hover:underline"
                      >
                        {item.title}
                      </Link>

                      <p className="text-sm text-gray-500">
                        {item.type}
                      </p>

                      {item.type === "digital" && (
                        <div className="mt-3">
                          {order.paymentStatus === "paid" &&
                          item.artworkId ? (
                            <a
                              href={`/${locale}/account/orders/download?orderId=${order.id}&artworkId=${item.artworkId}`}
                              className="inline-block rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-100"
                            >
                              Download
                            </a>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Download available after payment.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      {getCurrencySymbol(item.currency)}
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No matching orders
          </h2>

          <p className="mt-2 text-gray-500">
            Try changing the search or type filter.
          </p>
        </div>
      )}
    </div>
  );
}