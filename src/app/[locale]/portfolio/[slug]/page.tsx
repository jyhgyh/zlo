import Container from "@/components/layout/Container";
import { artworks } from "@/data/artworks";
import { notFound } from "next/navigation";
import Image from "next/image";

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function ArtworkPage({ params }: Props) {
    const { slug } = await params;

    const artwork = artworks.find(
        (item) => item.slug === slug
    );

    if (!artwork) {
        notFound();
    }

    return (
        <Container>
            <div className="py-10">
                <h1 className="mb-6 text-4xl font-bold">
                    {artwork.title}
                </h1>

                <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="mb-6 w-full rounded-lg"
                />

                <p className="mb-4">
                    {artwork.description}
                </p>

                <p>
                    <strong>Category:</strong>{" "}
                    {artwork.category}
                </p>

                <p>
                    <strong>Price:</strong> €
                    {artwork.price}
                </p>

                <p>
                    <strong>Type:</strong>{" "}
                    {artwork.type}
                </p>
                <div className="mt-8">
                    {artwork.type === "physical" ? (
                        <button className="rounded-lg border px-5 py-3">
                            Contact Artist
                        </button>
                    ) : (
                        <button className="rounded-lg border px-5 py-3">
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </Container>
    );
}