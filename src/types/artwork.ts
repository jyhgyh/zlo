export type ArtworkMedia = {
  id: string | number;
  url: string;
  alt: string;
  mediaType?: "image" | "video" | "archive";
};

export type Artwork = {
  id: string | number;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  image: string;
  gallery: ArtworkMedia[];
  videos?: ArtworkMedia[];
  type: "physical" | "digital";
  price: number;
  currency: "EUR" | "USD";
  category: string;
  categories: string[];
  tags: string[];
  featured?: boolean;
  // Optional for compatibility with existing demo artworks and older records.
  showInShop?: boolean;
  showInPortfolio?: boolean;
  isPurchasable?: boolean;
  year?: number;
  orientation?: "portrait" | "landscape";
  sizeCategory?: "small" | "medium" | "large";
  material?: "acrylic" | "oil" | "watercolor";
  surface?: "canvas" | "paper" | "glass";
  medium?: string;
  widthCm?: number;
  heightCm?: number;
  widthPx?: number;
  heightPx?: number;
  availability?: "available" | "sold";
};
