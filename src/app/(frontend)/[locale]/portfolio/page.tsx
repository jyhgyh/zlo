import Container from "@/components/layout/Container";
import PortfolioClient from "@/components/portfolio/PortfolioClient";
import ProjectCard from "@/components/portfolio/ProjectCard";
import { getArtworks } from "@/lib/getArtworks";
import { getProjects } from "@/lib/getProjects";
import { isPortfolioArtwork } from "@/lib/artworkVisibility";
import Link from "next/link";

type Props = { params: Promise<{ locale: string }> };

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  const [projects, allArtworks] = await Promise.all([getProjects(), getArtworks()]);
  const artworks = allArtworks.filter(isPortfolioArtwork);

  return (
    <Container>
      <h1 className="my-8 text-4xl font-bold">Portfolio</h1>
      <p className="mb-12 max-w-2xl text-gray-600">
        Professional projects, freelance work and selected art by Zlata.
        Available artwork can be found in the{" "}
        <Link href={`/${locale}/shop`} className="underline">Shop</Link>.
      </p>

      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-semibold">Professional & Freelance Projects</h2>
        {projects.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border p-8 text-gray-500">
            No published projects yet. Create one in Payload → Projects.
          </div>
        )}
      </section>

      <section className="pb-16">
        <h2 className="mb-6 text-3xl font-semibold">Selected Artworks</h2>
        {artworks.length ? (
          <PortfolioClient artworks={artworks} locale={locale} mode="portfolio" />
        ) : (
          <div className="rounded-xl border p-8 text-gray-500">
            No selected artworks yet. Enable Show in Portfolio for chosen paintings and personal art.
          </div>
        )}
      </section>
    </Container>
  );
}
