import { getPayloadClient } from "@/lib/payload";
import type { Project, ProjectMedia } from "@/types/project";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toMedia(value: unknown): ProjectMedia | undefined {
  if (!isObject(value) || typeof value.url !== "string" || !value.url) return;
  return {
    id: typeof value.id === "number" || typeof value.id === "string" ? value.id : value.url,
    url: value.url,
    alt: typeof value.alt === "string" ? value.alt : "Project image",
  };
}

function toString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function toNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => isObject(row) ? toString(row.name) : undefined)
    .filter((name): name is string => Boolean(name));
}

function normalize(doc: Record<string, unknown>): Project {
  const rows = Array.isArray(doc.gallery) ? doc.gallery : [];
  const gallery = rows.map((row) => isObject(row) ? toMedia(row.media) : undefined)
    .filter((media): media is ProjectMedia => Boolean(media));
  const videos = (Array.isArray(doc.videos) ? doc.videos : []).map(toMedia)
    .filter((media): media is ProjectMedia => Boolean(media));
  return {
    id: String(doc.id),
    title: String(doc.title ?? "Untitled project"),
    slug: String(doc.slug ?? ""),
    projectType: doc.projectType === "company" || doc.projectType === "freelance"
      ? doc.projectType : "personal",
    company: toString(doc.company),
    client: toString(doc.client),
    role: toString(doc.role),
    startDate: toString(doc.startDate),
    endDate: toString(doc.endDate),
    summary: toString(doc.summary),
    description: toString(doc.description),
    contribution: toString(doc.contribution),
    cover: toMedia(doc.cover),
    gallery,
    videos,
    skills: toNames(doc.skills),
    tools: toNames(doc.tools),
    externalLink: toString(doc.externalLink),
    featured: doc.featured === true,
  };
}

export async function getProjects(): Promise<Project[]> {
  const payload = await getPayloadClient();
  const projects: Project[] = [];
  let page = 1;
  while (true) {
    const result = await payload.find({
      collection: "projects",
      depth: 2,
      limit: 100,
      page,
      overrideAccess: false,
      sort: "-createdAt",
      where: { visibility: { equals: "published" } },
    });
    projects.push(...result.docs.map((doc) => normalize(doc as unknown as Record<string, unknown>)));
    if (!result.hasNextPage) break;
    page++;
  }
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "projects",
    depth: 2,
    limit: 1,
    overrideAccess: false,
    where: { and: [
      { slug: { equals: slug } },
      { visibility: { equals: "published" } },
    ] },
  });
  const doc = result.docs[0];
  return doc ? normalize(doc as unknown as Record<string, unknown>) : null;
}
