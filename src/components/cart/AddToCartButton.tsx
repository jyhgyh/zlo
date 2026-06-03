"use client";

import { useState } from "react";
import { addCartItem } from "@/lib/cart";
import { Artwork } from "@/types/artwork";
import Link from "next/link";

type AddToCartButtonProps = {
  artwork: Artwork;
  locale: string;
};

export default function AddToCartButton({
  artwork,
  locale,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addCartItem({
      id: String(artwork.id),
      title: artwork.title,
      slug: artwork.slug,
      image: artwork.image,
      price: artwork.price,
      currency: artwork.currency,
    });

    setAdded(true);
  }

  if (added) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border p-4 text-center text-green-700">
          Added to cart.
        </div>

        <Link
          href={`/${locale}/cart`}
          className="block w-full rounded-xl border px-6 py-4 text-center font-medium transition hover:bg-gray-100"
        >
          View Cart
        </Link>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="w-full rounded-xl border px-6 py-4 font-medium transition hover:bg-gray-100"
    >
      Add to Cart
    </button>
  );
}