// Legacy demo data. The live portfolio is loaded from Payload via getArtworks.ts.
// These items remain available for local prototypes and older components.
import type { Artwork } from "@/types/artwork";

const sunset: Omit<Artwork, "id"> = {
  title: "Golden Sunset",
  slug: "golden-sunset",
  description: "Original acrylic painting.",
  image: "https://picsum.photos/600/400?random=1",
  gallery: [
    {
      id: "demo-sunset",
      url: "https://picsum.photos/600/400?random=1",
      alt: "Golden Sunset",
    },
  ],
  type: "physical",
  price: 450,
  currency: "EUR",
  category: "Landscape",
  categories: ["Landscape"],
  tags: ["sunset", "sea", "nature"],
  featured: true,
  year: 2025,
  orientation: "landscape",
  sizeCategory: "large",
  material: "acrylic",
  surface: "canvas",
  widthCm: 100,
  heightCm: 70,
  availability: "available",
};

const galaxy: Omit<Artwork, "id"> = {
  title: "Galaxy Dreams",
  slug: "galaxy-dreams",
  description: "Digital artwork in PNG format.",
  image: "https://picsum.photos/600/400?random=2",
  gallery: [
    {
      id: "demo-galaxy",
      url: "https://picsum.photos/600/400?random=2",
      alt: "Galaxy Dreams",
    },
  ],
  type: "digital",
  price: 25,
  currency: "EUR",
  category: "Space",
  categories: ["Space"],
  tags: ["space", "stars", "galaxy"],
  featured: false,
  year: 2025,
  orientation: "portrait",
  sizeCategory: "medium",
  widthPx: 4096,
  heightPx: 6144,
  availability: "available",
};

export const artworks: Artwork[] = [
  { ...sunset, id: 1 },
  { ...galaxy, id: 2 },
  { ...sunset, id: 3 },
  { ...galaxy, id: 4 },
  { ...sunset, id: 5 },
  { ...galaxy, id: 6 },
];
