export type SiteMedia = {
  id: string | number;
  url: string;
  alt: string;
};

export type SiteSettings = {
  home: {
    title: string;
    subtitle: string;
    description: string;
    heroImage?: SiteMedia;
  };

  about: {
    title: string;
    image?: SiteMedia;
    paragraphs: string[];
  };

  resume: {
    title: string;
    education?: string;
    experience?: string;
    achievements?: string;
    cvFile?: SiteMedia;
  };

  contact: {
    title: string;
    description?: string;
    email?: string;
    instagram?: string;
    whatsapp?: string;
  };
};