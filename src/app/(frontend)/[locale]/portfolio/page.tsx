import Container from "@/components/layout/Container";
import ArtworkCard from "@/components/portfolio/ArtworkCard";
import PortfolioFilters from "@/components/portfolio/PortfolioFilters";
import { getArtworks } from "@/lib/getArtworks";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function PortfolioPage({
  params,
}: Props) {
  const { locale } = await params;
  const artworks = await getArtworks();

  return (
    <Container>
      <h1 className="my-8 text-4xl font-bold">
        Portfolio
      </h1>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <PortfolioFilters />

        {artworks.length > 0 ? (
          <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="mb-6 break-inside-avoid"
              >
                <ArtworkCard
                  artwork={artwork}
                  locale={locale}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border p-10 text-center text-gray-500">
            No artworks found. Add artworks in Payload Admin.
          </div>
        )}
      </div>
    </Container>
  );
}