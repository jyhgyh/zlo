import Link from "next/link";
import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork;
  locale?: string;
  mode?: "shop" | "portfolio";
};

export default function ArtworkCard({
  artwork,
  locale = "en",
  mode,
}: ArtworkCardProps) {
  const destination = mode ?? (artwork.showInPortfolio === true ? "portfolio" : "shop");
  const showPrice = destination === "shop";
  const imageClass = artwork.orientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]";

  return (
    <Link
      href={`/${locale}/${destination}/${artwork.slug}`}
      className="block overflow-hidden rounded-xl border transition hover:shadow-lg"
    >
      <div className={`${imageClass} bg-gray-100`}>
        {artwork.image ? (
          <img src={artwork.image} alt={artwork.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            Artwork Image
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-semibold">{artwork.title}</h2>
          {showPrice && (
            <span className="text-sm whitespace-nowrap">
              {artwork.type === "physical" && artwork.price <= 0
                ? "Price on request"
                : `${artwork.currency === "USD" ? "$" : "€"}${artwork.price}`}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">{artwork.category}</p>
        {destination === "shop" && artwork.type === "physical" && (
          <p className="text-sm text-gray-500">Contact artist to enquire</p>
        )}
        {artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {artwork.tags.map((tag) => (
              <span key={tag} className="rounded-full border px-2 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
