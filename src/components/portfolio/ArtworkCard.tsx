import Link from "next/link";
import { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork;
  locale?: string;
};

export default function ArtworkCard({
  artwork,
  locale = "en",
}: ArtworkCardProps) {
  const imageClass =
    artwork.orientation === "portrait"
      ? "aspect-[3/4]"
      : "aspect-[4/3]";

  return (
    <Link
      href={`/${locale}/portfolio/${artwork.slug}`}
      className="
        block
        overflow-hidden
        rounded-xl
        border
        transition
        hover:shadow-lg
      "
    >
      <div className={`${imageClass} bg-gray-100`}>
        {artwork.image ? (
          <img
            src={artwork.image}
            alt={artwork.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            Artwork Image
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-semibold">
            {artwork.title}
          </h2>

          <span className="text-sm">
            {artwork.currency === "USD" ? "$" : "€"}
            {artwork.price}
          </span>
        </div>

        <p className="text-sm text-gray-500">
          {artwork.category}
        </p>

        {artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {artwork.tags.map((tag) => (
              <span
                key={tag}
                className="
                  rounded-full
                  border
                  px-2
                  py-1
                  text-xs
                "
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}