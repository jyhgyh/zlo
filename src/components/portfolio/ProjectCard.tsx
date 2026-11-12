import Link from "next/link";
import type { Project } from "@/types/project";

type Props = { project: Project; locale: string };

export default function ProjectCard({ project, locale }: Props) {
  const cover = project.cover ?? project.gallery[0];
  return (
    <Link href={`/${locale}/portfolio/projects/${project.slug}`}
      className="block overflow-hidden rounded-xl border transition hover:shadow-lg">
      <div className="aspect-[4/3] bg-gray-100">
        {cover ? (
          <img src={cover.url} alt={cover.alt || project.title}
            className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Project</div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="text-sm text-gray-500 capitalize">{project.projectType}</div>
        <h3 className="text-lg font-semibold">{project.title}</h3>
        {project.role && <p className="text-sm text-gray-600">{project.role}</p>}
        {project.summary && <p className="text-sm text-gray-600">{project.summary}</p>}
      </div>
    </Link>
  );
}
