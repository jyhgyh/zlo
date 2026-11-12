import Container from "@/components/layout/Container";
import PortfolioClient from "@/components/portfolio/PortfolioClient";
import { getArtworks } from "@/lib/getArtworks";
import { isShopArtwork } from "@/lib/artworkVisibility";

type Props = { params: Promise<{ locale: string }> };

export default async function ShopPage({ params }: Props) {
  const { locale } = await params;
  const artworks = (await getArtworks()).filter(isShopArtwork);

  return (
    <Container>
      <h1 className="my-8 text-4xl font-bold">Shop</h1>
      <p className="mb-8 max-w-2xl text-gray-600">
        Digital art is purchased through secure Stripe Checkout. Physical paintings are
        available by contacting the artist directly. Sold originals are removed from Shop.
      </p>
      {artworks.length > 0 ? (
        <PortfolioClient artworks={artworks} locale={locale} mode="shop" />
      ) : (
        <div className="rounded-xl border p-10 text-center text-gray-500">
          No works in the shop yet. Select "Show in Shop" in Payload Admin.
        </div>
      )}
    </Container>
  );
}
