import Container from "@/components/layout/Container";
import ArtworkCard from "@/components/portfolio/ArtworkCard";
import PortfolioFilters from "@/components/portfolio/PortfolioFilters";
import { artworks } from "@/data/artworks";

export default function PortfolioPage() {
  return (
    <Container>
      <h1 className="my-8 text-4xl font-bold">
        Portfolio
      </h1>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <PortfolioFilters />

        <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="mb-6 break-inside-avoid"
            >
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}