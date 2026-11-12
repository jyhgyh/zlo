export type ProjectMedia = {
  id: string | number;
  url: string;
  alt: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  projectType: "company" | "freelance" | "personal";
  company?: string;
  client?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  description?: string;
  contribution?: string;
  cover?: ProjectMedia;
  gallery: ProjectMedia[];
  videos: ProjectMedia[];
  skills: string[];
  tools: string[];
  externalLink?: string;
  featured: boolean;
};
