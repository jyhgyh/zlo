import ArtworkDetails from "@/components/portfolio/ArtworkDetails";
import { getArtworkBySlug } from "@/lib/getArtworks";
import { isPortfolioArtwork, isShopArtwork } from "@/lib/artworkVisibility";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function ArtworkShopPage({ params }: Props) {
  const { locale, slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) notFound();
  if (!isShopArtwork(artwork)) {
    if (isPortfolioArtwork(artwork)) redirect(`/${locale}/portfolio/${artwork.slug}`);
    notFound();
  }

  return <ArtworkDetails artwork={artwork} locale={locale} mode="shop" />;
}
