"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CartItem, getCartItems } from "@/lib/cart";
import { createOrder } from "@/app/(frontend)/[locale]/checkout/actions";

type CheckoutClientProps = {
  locale: string;
  userEmail?: string;
  userName?: string;
  error?: string;
};

function getCurrencySymbol(currency: "EUR" | "USD") {
  return currency === "USD" ? "$" : "€";
}

function getErrorMessage(error?: string) {
  if (error === "empty-cart") {
    return "Your cart is empty.";
  }

  if (error === "missing-fields") {
    return "Please fill in your name and email.";
  }

  if (error === "invalid-cart") {
    return "Your cart contains invalid items.";
  }

  if (error === "mixed-currency") {
    return "All items in the cart must use the same currency.";
  }

  return "";
}

export default function CheckoutClient({
  locale,
  userEmail,
  userName,
  error,
}: CheckoutClientProps) {
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
  const errorMessage = getErrorMessage(error);

  if (!mounted) {
    return (
      <div className="rounded-xl border p-10 text-center text-gray-500">
        Loading checkout...
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
          Add digital artworks before checkout.
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
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form
        action={createOrder}
        className="space-y-4 rounded-xl border p-6"
      >
        {errorMessage && (
          <div className="rounded-xl border p-4 text-red-700">
            {errorMessage}
          </div>
        )}

        <input
          type="hidden"
          name="locale"
          value={locale}
        />

        <input
          type="hidden"
          name="cart"
          value={JSON.stringify(items)}
        />

        <div>
          <label className="mb-2 block text-sm text-gray-500">
            Name
          </label>

          <input
            type="text"
            name="customerName"
            defaultValue={userName || ""}
            className="w-full rounded-xl border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-500">
            Email
          </label>

          <input
            type="email"
            name="customerEmail"
            defaultValue={userEmail || ""}
            className="w-full rounded-xl border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-500">
            Notes
          </label>

          <textarea
            name="notes"
            rows={5}
            placeholder="Optional message"
            className="w-full rounded-xl border p-3"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl border px-6 py-3 font-medium transition hover:bg-gray-100"
        >
          Create Order
        </button>
      </form>

      <aside className="h-fit rounded-xl border p-6">
        <h2 className="text-2xl font-semibold">
          Order Summary
        </h2>

        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 border-b pb-3"
            >
              <span>{item.title}</span>

              <span>
                {getCurrencySymbol(item.currency)}
                {item.price}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-xl font-semibold">
          <span>Total</span>

          <span>
            {getCurrencySymbol(currency)}
            {total}
          </span>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Payment will be connected in the next step.
        </p>
      </aside>
    </div>
  );
}