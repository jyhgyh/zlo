import Container from "@/components/layout/Container";
import Link from "next/link";
import type { Project } from "@/types/project";

type Props = { project: Project; locale: string };

function safeExternalLink(value?: string): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return parsed.href;
  } catch { /* invalid URL */ }
  return null;
}

export default function ProjectDetails({ project, locale }: Props) {
  const link = safeExternalLink(project.externalLink);
  const hero = project.cover ?? project.gallery[0];
  return (
    <Container>
      <article className="py-12">
        <div className="mb-8 text-sm text-gray-500">
          <Link className="hover:underline" href={`/${locale}/portfolio`}>Portfolio</Link>
          {" / "}{project.title}
        </div>
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 text-sm text-gray-500 capitalize">{project.projectType} project</div>
          <h1 className="text-4xl font-bold">{project.title}</h1>
          {project.summary && <p className="mt-5 text-lg text-gray-600">{project.summary}</p>}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            {project.company && <span>Company: {project.company}</span>}
            {project.client && <span>Client: {project.client}</span>}
            {project.role && <span>Role: {project.role}</span>}
            {project.startDate && <span>Started: {project.startDate.slice(0, 10)}</span>}
            {project.endDate && <span>Finished: {project.endDate.slice(0, 10)}</span>}
          </div>
        </div>
        {hero && <img src={hero.url} alt={hero.alt} className="mb-10 w-full rounded-xl object-cover" />}
        {project.description && (
          <section className="mb-10 max-w-3xl">
            <h2 className="mb-3 text-2xl font-semibold">About the project</h2>
            <p className="whitespace-pre-line text-gray-600">{project.description}</p>
          </section>
        )}
        {project.contribution && (
          <section className="mb-10 max-w-3xl">
            <h2 className="mb-3 text-2xl font-semibold">My contribution</h2>
            <p className="whitespace-pre-line text-gray-600">{project.contribution}</p>
          </section>
        )}
        {project.gallery.length > 0 && (
          <div className="mb-10 grid gap-4 md:grid-cols-2">
            {project.gallery.map((media) => (
              <img key={media.id} src={media.url} alt={media.alt} className="w-full rounded-xl" />
            ))}
          </div>
        )}
        {project.videos.length > 0 && (
          <div className="mb-10 grid gap-4 md:grid-cols-2">
            {project.videos.map((video) => (
              <video key={video.id} controls preload="metadata" className="w-full rounded-xl">
                <source src={video.url} />
              </video>
            ))}
          </div>
        )}
        {(project.skills.length > 0 || project.tools.length > 0) && (
          <section className="mb-10 space-y-3">
            {project.skills.length > 0 && <p>Skills: {project.skills.join(", ")}</p>}
            {project.tools.length > 0 && <p>Tools: {project.tools.join(", ")}</p>}
          </section>
        )}
        {link && <a href={link} target="_blank" rel="noopener noreferrer"
          className="inline-block rounded-xl border px-6 py-3 hover:bg-gray-100">
          View published project
        </a>}
      </article>
    </Container>
  );
}
