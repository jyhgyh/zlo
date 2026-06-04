import { getPayloadClient } from "@/lib/payload";

export type OrderItem = {
  id?: string | number;
  artworkId?: string | number;
  title: string;
  slug: string;
  image?: string;
  price: number;
  currency: "EUR" | "USD";
  type: "digital" | "physical";
};

export type UserOrder = {
  id: string | number;
  items: OrderItem[];
  total: number;
  currency: "EUR" | "USD";
  status: "pending" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  createdAt?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getRelationId(value: unknown): string | number | undefined {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  if (isObject(value)) {
    const id = value.id;

    if (typeof id === "string" || typeof id === "number") {
      return id;
    }
  }

  return undefined;
}

function normalizeOrder(doc: Record<string, unknown>): UserOrder {
  const items = Array.isArray(doc.items)
    ? doc.items
        .filter((item) => isObject(item))
        .map((item) => ({
          id:
            typeof item.id === "string" ||
            typeof item.id === "number"
              ? item.id
              : undefined,

          artworkId: getRelationId(item.artwork),

          title:
            typeof item.title === "string"
              ? item.title
              : "Untitled artwork",

          slug:
            typeof item.slug === "string"
              ? item.slug
              : "",

          image:
            typeof item.image === "string"
              ? item.image
              : undefined,

          price:
            typeof item.price === "number"
              ? item.price
              : 0,

          currency:
            item.currency === "USD" ? "USD" : "EUR",

          type:
            item.type === "physical"
              ? "physical"
              : "digital",
        }))
    : [];

  return {
    id: String(doc.id),

    items,

    total:
      typeof doc.total === "number"
        ? doc.total
        : 0,

    currency:
      doc.currency === "USD" ? "USD" : "EUR",

    status:
      doc.status === "completed" ||
      doc.status === "cancelled"
        ? doc.status
        : "pending",

    paymentStatus:
      doc.paymentStatus === "paid" ||
      doc.paymentStatus === "refunded"
        ? doc.paymentStatus
        : "unpaid",

    createdAt:
      typeof doc.createdAt === "string"
        ? doc.createdAt
        : undefined,
  };
}

export async function getOrdersByUser(
  userId: string | number
): Promise<UserOrder[]> {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "orders" as never,
    depth: 2,
    limit: 100,
    sort: "-createdAt",
    where: {
      user: {
        equals: userId,
      },
    },
    overrideAccess: true,
  });

  return result.docs.map((doc) =>
    normalizeOrder(doc as Record<string, unknown>)
  );
}