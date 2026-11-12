import Container from "@/components/layout/Container";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { getCurrentUser } from "@/lib/currentUser";
import { isArtworkFavorite } from "@/lib/favorites";
import { getPaidOrderIdForArtwork } from "@/lib/orders";
import { canPurchaseArtwork, isShopArtwork } from "@/lib/artworkVisibility";
import { toggleFavorite } from "@/app/(frontend)/[locale]/portfolio/[slug]/actions";
import type { Artwork } from "@/types/artwork";
import Link from "next/link";

type ArtworkDetailsProps = {
  artwork: Artwork;
  locale: string;
  mode: "shop" | "portfolio";
};

export default async function ArtworkDetails({ artwork, locale, mode }: ArtworkDetailsProps) {
  const user = await getCurrentUser();
  const favorite = user ? await isArtworkFavorite(user.id, artwork.id) : false;
  const paidOrderId = user && mode === "shop" && artwork.type === "digital"
    ? await getPaidOrderIdForArtwork(user.id, artwork.id)
    : null;
  const mainImage = artwork.gallery[0];
  const canBuy = canPurchaseArtwork(artwork);

  return (
    <Container>
      <div className="py-12">
        <div className="mb-8 text-sm text-gray-500">
          <Link href={`/${locale}/${mode}`} className="hover:underline">
            {mode === "shop" ? "Shop" : "Portfolio"}
          </Link>
          {" / "}{artwork.title}
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border bg-gray-100">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={mainImage.alt}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  Artwork Image
                </div>
              )}
            </div>
            {artwork.gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {artwork.gallery.map((image) => (
                  <div key={image.id} className="aspect-square overflow-hidden rounded-lg border bg-gray-100">
                    <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {artwork.videos && artwork.videos.length > 0 && (
              <div className="mt-6 space-y-4">
                {artwork.videos.map((video) => (
                  <video key={video.id} controls preload="metadata" className="w-full rounded-xl border">
                    <source src={video.url} />
                    Your browser does not support video playback.
                  </video>
                ))}
              </div>
            )}
          </div>

          <div>
            {mode === "shop" && (
              <div className="mb-4">
                <span className="rounded-full border px-3 py-1 text-sm">
                  {artwork.type === "physical" ? "Original painting · Contact to enquire" : "Digital download"}
                </span>
              </div>
            )}
            <h1 className="text-5xl font-bold">{artwork.title}</h1>
            {mode === "shop" && (
              <p className="mt-4 text-3xl">
                {artwork.type === "physical" && artwork.price <= 0
                  ? "Price on request"
                  : `${artwork.currency === "USD" ? "$" : "€"}${artwork.price}`}
              </p>
            )}
            {artwork.description && (
              <p className="mt-8 whitespace-pre-line text-gray-600">{artwork.description}</p>
            )}
            {artwork.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span key={tag} className="rounded-full border px-3 py-1 text-sm">{tag}</span>
                ))}
              </div>
            )}
            <div className="mt-10 space-y-4 border-t pt-8">
              <div className="flex justify-between gap-6"><span>Type</span><span>{artwork.type}</span></div>
              <div className="flex justify-between gap-6"><span>Category</span><span>{artwork.category}</span></div>
              {artwork.year !== undefined && (
                <div className="flex justify-between gap-6"><span>Year</span><span>{artwork.year}</span></div>
              )}
              {artwork.sizeCategory && (
                <div className="flex justify-between gap-6"><span>Size</span><span>{artwork.sizeCategory}</span></div>
              )}
              {artwork.medium && (
                <div className="flex justify-between gap-6"><span>Medium</span><span>{artwork.medium}</span></div>
              )}
              {artwork.material && (
                <div className="flex justify-between gap-6"><span>Material</span><span>{artwork.material}</span></div>
              )}
              {artwork.surface && (
                <div className="flex justify-between gap-6"><span>Surface</span><span>{artwork.surface}</span></div>
              )}
              {artwork.widthCm && artwork.heightCm && (
                <div className="flex justify-between gap-6">
                  <span>Dimensions</span><span>{artwork.widthCm} × {artwork.heightCm} cm</span>
                </div>
              )}
              {artwork.widthPx && artwork.heightPx && (
                <div className="flex justify-between gap-6">
                  <span>Resolution</span><span>{artwork.widthPx} × {artwork.heightPx} px</span>
                </div>
              )}
            </div>

            <div className="mt-10 space-y-3">
              {user ? (
                <form action={toggleFavorite}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="source" value={mode} />
                  <input type="hidden" name="slug" value={artwork.slug} />
                  <input type="hidden" name="artworkId" value={artwork.id} />
                  <button
                    type="submit"
                    className="w-full rounded-xl border px-6 py-4 font-medium transition hover:bg-gray-100"
                  >
                    {favorite ? "Remove from favorites" : "Add to favorites"}
                  </button>
                </form>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="block w-full rounded-xl border px-6 py-4 text-center font-medium transition hover:bg-gray-100"
                >
                  Login to add to favorites
                </Link>
              )}

              {mode === "portfolio" ? (
                isShopArtwork(artwork) && (
                  <Link
                    href={`/${locale}/shop/${artwork.slug}`}
                    className="block w-full rounded-xl border px-6 py-4 text-center font-medium transition hover:bg-gray-100"
                  >
                    View in Shop
                  </Link>
                )
              ) : paidOrderId ? (
                <div className="space-y-3">
                  <p className="rounded-xl border p-4 text-center text-green-700">
                    You already purchased this artwork.
                  </p>
                  <a
                    href={`/${locale}/account/orders/download?orderId=${paidOrderId}&artworkId=${artwork.id}`}
                    className="block w-full rounded-xl border px-6 py-4 text-center font-medium transition hover:bg-gray-100"
                  >
                    Download
                  </a>
                  <Link
                    href={`/${locale}/account/orders`}
                    className="block w-full rounded-xl border px-6 py-4 text-center font-medium transition hover:bg-gray-100"
                  >
                    View Orders
                  </Link>
                </div>
              ) : artwork.type === "physical" ? (
                <Link
                  href={`/${locale}/contact?artwork=${encodeURIComponent(artwork.slug)}`}
                  className="block w-full rounded-xl border px-6 py-4 text-center font-medium transition hover:bg-gray-100"
                >
                  Contact Artist About This Painting
                </Link>
              ) : !canBuy ? (
                <p className="rounded-xl border p-4 text-center text-gray-500">
                  This artwork is not currently available for purchase.
                </p>
              ) : (
                <AddToCartButton artwork={artwork} locale={locale} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
