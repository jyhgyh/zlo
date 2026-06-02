import Container from "@/components/layout/Container";
import { artworks } from "@/data/artworks";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArtworkPage({
  params,
}: Props) {
  const { slug } = await params;

  const artwork = artworks.find(
    (item) => item.slug === slug
  );

  if (!artwork) {
    notFound();
  }

  return (
    <Container>
      <div className="py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* IMAGE */}

          <div>
            <div className="aspect-[4/5] rounded-2xl border bg-gray-100">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
          </div>

          {/* INFO */}

          <div>
            <div className="mb-4">
              <span
                className="
                  rounded-full
                  border
                  px-3
                  py-1
                  text-sm
                "
              >
                {artwork.availability}
              </span>
            </div>

            <h1 className="text-5xl font-bold">
              {artwork.title}
            </h1>

            <p className="mt-4 text-3xl">
              €{artwork.price}
            </p>

            <p className="mt-8 text-gray-600">
              {artwork.description}
            </p>

            {/* TAGS */}

            <div className="mt-8 flex flex-wrap gap-2">
              {artwork.tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-full
                    border
                    px-3
                    py-1
                    text-sm
                  "
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* DETAILS */}

            <div className="mt-10 space-y-4 border-t pt-8">
              <div className="flex justify-between">
                <span>Type</span>
                <span>{artwork.type}</span>
              </div>

              <div className="flex justify-between">
                <span>Category</span>
                <span>{artwork.category}</span>
              </div>

              <div className="flex justify-between">
                <span>Size</span>
                <span>
                  {artwork.sizeCategory}
                </span>
              </div>

              {artwork.material && (
                <div className="flex justify-between">
                  <span>Material</span>
                  <span>
                    {artwork.material}
                  </span>
                </div>
              )}

              {artwork.surface && (
                <div className="flex justify-between">
                  <span>Surface</span>
                  <span>
                    {artwork.surface}
                  </span>
                </div>
              )}

              {artwork.widthCm &&
                artwork.heightCm && (
                  <div className="flex justify-between">
                    <span>Dimensions</span>
                    <span>
                      {artwork.widthCm} ×{" "}
                      {artwork.heightCm} cm
                    </span>
                  </div>
                )}

              {artwork.widthPx &&
                artwork.heightPx && (
                  <div className="flex justify-between">
                    <span>Resolution</span>
                    <span>
                      {artwork.widthPx} ×{" "}
                      {artwork.heightPx} px
                    </span>
                  </div>
                )}
            </div>

            {/* ACTION */}

            <div className="mt-10">
              {artwork.type ===
              "physical" ? (
                <button
                  className="
                    w-full
                    rounded-xl
                    border
                    px-6
                    py-4
                    font-medium
                  "
                >
                  Contact Artist
                </button>
              ) : (
                <button
                  className="
                    w-full
                    rounded-xl
                    border
                    px-6
                    py-4
                    font-medium
                  "
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}