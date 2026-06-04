import Container from "@/components/layout/Container";
import { getCurrentUser } from "@/lib/currentUser";
import { getOrdersByUser } from "@/lib/orders";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

function getCurrencySymbol(currency: "EUR" | "USD") {
  return currency === "USD" ? "$" : "€";
}

export default async function OrdersPage({
  params,
}: Props) {
  const { locale } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const orders = await getOrdersByUser(user.id);

  return (
    <Container>
      <section className="py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Orders
          </h1>

          <p className="mt-2 text-gray-500">
            Your purchases and order history.
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Order #{order.id}
                    </h2>

                    {order.createdAt && (
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {getCurrencySymbol(order.currency)}
                      {order.total}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.status} / {order.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.slug}`}
                      className="grid gap-4 md:grid-cols-[80px_1fr_auto]"
                    >
                      <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            Image
                          </div>
                        )}
                      </div>

                      <div>
                        <Link
                          href={`/${locale}/portfolio/${item.slug}`}
                          className="font-medium hover:underline"
                        >
                          {item.title}
                        </Link>

                        <p className="text-sm text-gray-500">
                          {item.type}
                        </p>

                        {item.type === "digital" && (
                          <div className="mt-3">
                            {order.paymentStatus === "paid" &&
                            item.artworkId ? (
                              <a
                                href={`/${locale}/account/orders/download?orderId=${order.id}&artworkId=${item.artworkId}`}
                                className="inline-block rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-100"
                              >
                                Download
                              </a>
                            ) : (
                              <p className="text-sm text-gray-500">
                                Download available after payment.
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        {getCurrencySymbol(item.currency)}
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              Your orders will appear here after checkout.
            </p>

            <Link
              href={`/${locale}/portfolio`}
              className="mt-6 inline-block rounded-xl border px-6 py-3 transition hover:bg-gray-100"
            >
              Browse portfolio
            </Link>
          </div>
        )}
      </section>
    </Container>
  );
}