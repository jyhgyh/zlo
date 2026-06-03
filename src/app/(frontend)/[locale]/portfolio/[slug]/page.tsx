import Container from "@/components/layout/Container";
import { getArtworkBySlug } from "@/lib/getArtworks";
import { getCurrentUser } from "@/lib/currentUser";
import { isArtworkFavorite } from "@/lib/favorites";
import { notFound } from "next/navigation";
import Link from "next/link";
import { toggleFavorite } from "./actions";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function ArtworkPage({
  params,
}: Props) {
  const { locale, slug } = await params;

  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  const user = await getCurrentUser();

  const favorite = user
    ? await isArtworkFavorite(user.id, artwork.id)
    : false;

  const mainImage = artwork.gallery[0];

  return (
    <Container>
      <div className="py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="aspect-[4/5] rounded-2xl border bg-gray-100">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={mainImage.alt}
                  className="h-full w-full rounded-2xl object-cover"
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
                  <div
                    key={image.id}
                    className="aspect-square overflow-hidden rounded-lg border bg-gray-100"
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-4">
              <span className="rounded-full border px-3 py-1 text-sm">
                {artwork.availability}
              </span>
            </div>

            <h1 className="text-5xl font-bold">
              {artwork.title}
            </h1>

            <p className="mt-4 text-3xl">
              {artwork.currency === "USD" ? "$" : "€"}
              {artwork.price}
            </p>

            {artwork.description && (
              <p className="mt-8 text-gray-600">
                {artwork.description}
              </p>
            )}

            {artwork.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-3 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10 space-y-4 border-t pt-8">
              <div className="flex justify-between gap-6">
                <span>Type</span>
                <span>{artwork.type}</span>
              </div>

              <div className="flex justify-between gap-6">
                <span>Category</span>
                <span>{artwork.category}</span>
              </div>

              {artwork.year && (
                <div className="flex justify-between gap-6">
                  <span>Year</span>
                  <span>{artwork.year}</span>
                </div>
              )}

              {artwork.sizeCategory && (
                <div className="flex justify-between gap-6">
                  <span>Size</span>
                  <span>{artwork.sizeCategory}</span>
                </div>
              )}

              {artwork.medium && (
                <div className="flex justify-between gap-6">
                  <span>Medium</span>
                  <span>{artwork.medium}</span>
                </div>
              )}

              {artwork.material && (
                <div className="flex justify-between gap-6">
                  <span>Material</span>
                  <span>{artwork.material}</span>
                </div>
              )}

              {artwork.surface && (
                <div className="flex justify-between gap-6">
                  <span>Surface</span>
                  <span>{artwork.surface}</span>
                </div>
              )}

              {artwork.widthCm && artwork.heightCm && (
                <div className="flex justify-between gap-6">
                  <span>Dimensions</span>
                  <span>
                    {artwork.widthCm} × {artwork.heightCm} cm
                  </span>
                </div>
              )}

              {artwork.widthPx && artwork.heightPx && (
                <div className="flex justify-between gap-6">
                  <span>Resolution</span>
                  <span>
                    {artwork.widthPx} × {artwork.heightPx} px
                  </span>
                </div>
              )}
            </div>

            <div className="mt-10 space-y-3">
              {user ? (
                <form action={toggleFavorite}>
                  <input
                    type="hidden"
                    name="locale"
                    value={locale}
                  />

                  <input
                    type="hidden"
                    name="slug"
                    value={artwork.slug}
                  />

                  <input
                    type="hidden"
                    name="artworkId"
                    value={artwork.id}
                  />

                  <button
                    type="submit"
                    className="w-full rounded-xl border px-6 py-4 font-medium transition hover:bg-gray-100"
                  >
                    {favorite
                      ? "Remove from favorites"
                      : "Add to favorites"}
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

              {artwork.type === "physical" ? (
                <Link
                  href={`/${locale}/contact`}
                  className="block w-full rounded-xl border px-6 py-4 text-center font-medium transition hover:bg-gray-100"
                >
                  Contact Artist
                </Link>
              ) : (
                <button
                  className="w-full rounded-xl border px-6 py-4 font-medium transition hover:bg-gray-100"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}