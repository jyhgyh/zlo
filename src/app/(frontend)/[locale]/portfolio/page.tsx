import Container from "@/components/layout/Container";
import PortfolioClient from "@/components/portfolio/PortfolioClient";
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

      {artworks.length > 0 ? (
        <PortfolioClient
          artworks={artworks}
          locale={locale}
        />
      ) : (
        <div className="rounded-xl border p-10 text-center text-gray-500">
          No artworks found. Add artworks in Payload Admin.
        </div>
      )}
    </Container>
  );
}