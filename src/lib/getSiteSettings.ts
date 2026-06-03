import { getPayloadClient } from "@/lib/payload";
import { SiteMedia, SiteSettings } from "@/types/site-settings";

type PayloadMedia = {
  id?: string | number;
  url?: string;
  alt?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeMedia(media: unknown): SiteMedia | undefined {
  if (!isObject(media)) {
    return undefined;
  }

  const data = media as PayloadMedia;

  if (!data.url) {
    return undefined;
  }

  return {
    id: data.id ?? data.url,
    url: data.url,
    alt: data.alt ?? "Image",
  };
}

function getString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const payload = await getPayloadClient();

  const settings = await payload.findGlobal({
    slug: "site-settings" as never,
    depth: 2,
  });

  const home = isObject(settings.home) ? settings.home : {};
  const about = isObject(settings.about) ? settings.about : {};
  const resume = isObject(settings.resume) ? settings.resume : {};
  const contact = isObject(settings.contact) ? settings.contact : {};

  const aboutParagraphs = Array.isArray(about.paragraphs)
    ? about.paragraphs
        .map((item) => {
          if (!isObject(item)) {
            return null;
          }

          return getString(item.text);
        })
        .filter((item): item is string => Boolean(item))
    : [];

  return {
    home: {
      title: getString(home.title, "Zlata"),
      subtitle: getString(home.subtitle, "Artist & Illustrator"),
      description: getString(
        home.description,
        "Discover original artworks, illustrations, and digital creations."
      ),
      heroImage: normalizeMedia(home.heroImage),
    },

    about: {
      title: getString(about.title, "About Me"),
      image: normalizeMedia(about.image),
      paragraphs:
        aboutParagraphs.length > 0
          ? aboutParagraphs
          : [
              "This section will contain the artist biography managed through Payload CMS.",
              "Here visitors can learn more about artistic background, inspiration, techniques, exhibitions and creative journey.",
            ],
    },

    resume: {
      title: getString(resume.title, "Resume"),
      education: getString(resume.education),
      experience: getString(resume.experience),
      achievements: getString(resume.achievements),
      cvFile: normalizeMedia(resume.cvFile),
    },

    contact: {
      title: getString(contact.title, "Contact"),
      description: getString(
        contact.description,
        "For commissions, purchases or collaborations, feel free to contact me."
      ),
      email: getString(contact.email),
      instagram: getString(contact.instagram),
      whatsapp: getString(contact.whatsapp),
    },
  };
}