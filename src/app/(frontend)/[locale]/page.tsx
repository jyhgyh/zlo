import Link from "next/link";
import Container from "@/components/layout/Container";
import FeaturedWorks from "@/components/portfolio/FeaturedWorks";
import { getSiteSettings } from "@/lib/getSiteSettings";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HomePage({
  params,
}: Props) {
  const { locale } = await params;
  const settings = await getSiteSettings();

  return (
    <Container>
      <section className="grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-6xl font-bold">
            {settings.home.title}
          </h1>

          <p className="mt-4 text-xl text-gray-500">
            {settings.home.subtitle}
          </p>

          <p className="mt-6 max-w-lg text-gray-600">
            {settings.home.description}
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href={`/${locale}/portfolio`}
              className="rounded-lg border px-5 py-3 transition hover:bg-gray-100"
            >
              View Portfolio
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="rounded-lg border px-5 py-3 transition hover:bg-gray-100"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {settings.home.heroImage ? (
            <img
              src={settings.home.heroImage.url}
              alt={settings.home.heroImage.alt}
              className="h-[500px] w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-[500px] w-full items-center justify-center rounded-2xl border bg-gray-100 text-gray-400">
              Hero Image
            </div>
          )}
        </div>
      </section>

      <FeaturedWorks locale={locale} />
    </Container>
  );
}