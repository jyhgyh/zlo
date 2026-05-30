import Link from "next/link";
import Container from "@/components/layout/Container";
import FeaturedWorks from "@/components/portfolio/FeaturedWorks";

export default function HomePage() {
  return (
    <Container>
      <section className="grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-6xl font-bold">
            Zlata
          </h1>

          <p className="mt-4 text-xl text-gray-500">
            Artist & Illustrator
          </p>

          <p className="mt-6 max-w-lg text-gray-600">
            Discover original artworks, illustrations,
            and digital creations. Browse the portfolio
            and find unique pieces available for purchase.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/en/portfolio"
              className="rounded-lg border px-5 py-3 transition hover:bg-gray-100"
            >
              View Portfolio
            </Link>

            <Link
              href="/en/contact"
              className="rounded-lg border px-5 py-3 transition hover:bg-gray-100"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex h-[500px] w-full items-center justify-center rounded-2xl border bg-gray-100 text-gray-400">
            Hero Image
          </div>
        </div>
      </section>

      <FeaturedWorks />
    </Container>
  );
}