import ArtworkCard from "./ArtworkCard";
import { getArtworks } from "@/lib/getArtworks";

type FeaturedWorksProps = {
  locale?: string;
};

export default async function FeaturedWorks({
  locale = "en",
}: FeaturedWorksProps) {
  const artworks = await getArtworks();

  const featured = artworks.filter(
    (artwork) => artwork.featured
  );

  return (
    <section className="py-20">
      <h2 className="mb-8 text-3xl font-bold">
        Featured Works
      </h2>

      {featured.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-8 text-center text-gray-500">
          No featured artworks yet. Mark artworks as featured in Payload Admin.
        </div>
      )}
    </section>
  );
}