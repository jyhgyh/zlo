import { getOrdersByUser } from "@/lib/orders";

export type UserDownload = {
  orderId: string | number;
  artworkId: string | number;
  title: string;
  slug: string;
  image?: string;
  price: number;
  currency: "EUR" | "USD";
  purchasedAt?: string;
};

export async function getDownloadsByUser(
  userId: string | number
): Promise<UserDownload[]> {
  const orders = await getOrdersByUser(userId);

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "paid"
  );

  const downloadsMap = new Map<string, UserDownload>();

  for (const order of paidOrders) {
    for (const item of order.items) {
      if (item.type !== "digital") {
        continue;
      }

      if (!item.artworkId) {
        continue;
      }

      const artworkKey = String(item.artworkId);

      if (downloadsMap.has(artworkKey)) {
        continue;
      }

      downloadsMap.set(artworkKey, {
        orderId: order.id,
        artworkId: item.artworkId,
        title: item.title,
        slug: item.slug,
        image: item.image,
        price: item.price,
        currency: item.currency,
        purchasedAt: order.createdAt,
      });
    }
  }

  return Array.from(downloadsMap.values());
}