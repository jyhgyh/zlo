import ArtworkCard from "./ArtworkCard";
import { artworks } from "@/data/artworks";

export default function FeaturedWorks() {
  const featured = artworks.filter(
    (artwork) => artwork.featured
  );

  return (
    <section className="py-20">
      <h2 className="mb-8 text-3xl font-bold">
        Featured Works
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
          />
        ))}
      </div>
    </section>
  );
}
