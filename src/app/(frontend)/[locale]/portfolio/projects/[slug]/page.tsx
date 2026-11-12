import ProjectDetails from "@/components/portfolio/ProjectDetails";
import { getProjectBySlug } from "@/lib/getProjects";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetails project={project} locale={locale} />;
}
