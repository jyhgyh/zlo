"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CartItem,
  clearCart,
  getCartItems,
  removeCartItem,
} from "@/lib/cart";

type CartClientProps = {
  locale: string;
};

function getCurrencySymbol(currency: "EUR" | "USD") {
  return currency === "USD" ? "$" : "€";
}

export default function CartClient({
  locale,
}: CartClientProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(getCartItems());
    setMounted(true);
  }, []);

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.price,
      0
    );
  }, [items]);

  const currency = items[0]?.currency ?? "EUR";

  function handleRemove(id: string) {
    const nextItems = removeCartItem(id);

    setItems(nextItems);
  }

  function handleClear() {
    clearCart();

    setItems([]);
  }

  if (!mounted) {
    return (
      <div className="rounded-xl border p-10 text-center text-gray-500">
        Loading cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border p-10 text-center">
        <h2 className="text-2xl font-semibold">
          Your cart is empty
        </h2>

        <p className="mt-2 text-gray-500">
          Add digital artworks to your cart before checkout.
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
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid gap-4 rounded-xl border p-4 md:grid-cols-[120px_1fr_auto]"
          >
            <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  Image
                </div>
              )}
            </div>

            <div>
              <Link
                href={`/${locale}/portfolio/${item.slug}`}
                className="text-lg font-semibold hover:underline"
              >
                {item.title}
              </Link>

              <p className="mt-2 text-gray-500">
                Digital artwork
              </p>

              <p className="mt-2">
                {getCurrencySymbol(item.currency)}
                {item.price}
              </p>
            </div>

            <div className="flex items-start justify-end">
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-100"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit rounded-xl border p-6">
        <h2 className="text-2xl font-semibold">
          Summary
        </h2>

        <div className="mt-6 flex justify-between border-b pb-4">
          <span>Items</span>
          <span>{items.length}</span>
        </div>

        <div className="mt-4 flex justify-between text-xl font-semibold">
          <span>Total</span>
          <span>
            {getCurrencySymbol(currency)}
            {total}
          </span>
        </div>

        <button
          type="button"
          className="mt-6 w-full rounded-xl border px-6 py-3 font-medium transition hover:bg-gray-100"
        >
          Checkout
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="mt-3 w-full rounded-xl border px-6 py-3 text-gray-500 transition hover:bg-gray-100"
        >
          Clear cart
        </button>
      </aside>
    </div>
  );
}