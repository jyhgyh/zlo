import type { Artwork } from "@/types/artwork";

// Only published for-sale work is shown in Shop. A physical original disappears
// from Shop as soon as the artist manually changes availability to "sold".
export function isShopArtwork(artwork: Artwork): boolean {
  return (
    artwork.showInShop !== false &&
    artwork.isPurchasable !== false &&
    artwork.availability !== "sold" &&
    (artwork.type === "physical" ||
      (Number.isFinite(artwork.price) && artwork.price > 0))
  );
}

// Portfolio is curated independently from Shop, including sold paintings.
export function isPortfolioArtwork(artwork: Artwork): boolean {
  return artwork.showInPortfolio === true;
}

// Only digital artwork may enter Stripe Checkout. Physical paintings never do.
export function canPurchaseArtwork(artwork: Artwork): boolean {
  return (
    artwork.type === "digital" &&
    isShopArtwork(artwork) &&
    Number.isFinite(artwork.price) &&
    artwork.price > 0
  );
}
