import Container from "@/components/layout/Container";
import ArtworkCard from "@/components/portfolio/ArtworkCard";
import { getCurrentUser } from "@/lib/currentUser";
import { getFavoriteArtworks } from "@/lib/favorites";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function FavoritesPage({
  params,
}: Props) {
  const { locale } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const favorites = await getFavoriteArtworks(user.id);

  return (
    <Container>
      <section className="py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Favorites
          </h1>

          <p className="mt-2 text-gray-500">
            Your saved artworks.
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No favorites yet
            </h2>

            <p className="mt-2 text-gray-500">
              Save artworks you like and they will appear here.
            </p>

            <Link
              href={`/${locale}/portfolio`}
              className="mt-6 inline-block rounded-xl border px-6 py-3 transition hover:bg-gray-100"
            >
              Browse portfolio
            </Link>
          </div>
        )}
      </section>
    </Container>
  );
}