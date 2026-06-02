export type Artwork = {
  id: number;

  title: string;
  slug: string;

  description: string;

  image: string;

  type: "physical" | "digital";

  price: number;

  currency: "EUR";

  category: string;

  tags: string[];

  featured?: boolean;

  year?: number;

  orientation:
    | "portrait"
    | "landscape";

  sizeCategory:
    | "small"
    | "medium"
    | "large";

  material?:
    | "acrylic"
    | "oil"
    | "watercolor";

  surface?:
    | "canvas"
    | "paper"
    | "glass";

  widthCm?: number;
  heightCm?: number;

  widthPx?: number;
  heightPx?: number;

  availability:
    | "available"
    | "sold";
};