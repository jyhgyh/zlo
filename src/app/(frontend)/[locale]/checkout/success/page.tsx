import Container from "@/components/layout/Container";
import ClearCartOnMount from "@/components/cart/ClearCartOnMount";
import { getCurrentUser } from "@/lib/currentUser";
import { getPayloadClient } from "@/lib/payload";
import Link from "next/link";

type Props = {
  params: Promise<{
    locale: string;
  }>;

  searchParams: Promise<{
    order?: string;
  }>;
};

function toPayloadId(value: string): string | number {
  const numberValue = Number(value);

  if (!Number.isNaN(numberValue) && value.trim() !== "") {
    return numberValue;
  }

  return value;
}

function getRelationId(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "id" in value
  ) {
    const id = value.id;

    if (typeof id === "string" || typeof id === "number") {
      return String(id);
    }
  }

  return "";
}

async function getOrderPaymentStatus(
  orderId: string,
  userId: string | number
) {
  const payload = await getPayloadClient();

  try {
    const order = await payload.findByID({
      collection: "orders" as never,
      id: toPayloadId(orderId),
      depth: 1,
      overrideAccess: true,
    });

    const orderData = order as Record<string, unknown>;

    const orderUserId = getRelationId(orderData.user);

    if (orderUserId !== String(userId)) {
      return null;
    }

    return {
      status:
        typeof orderData.status === "string"
          ? orderData.status
          : "pending",

      paymentStatus:
        typeof orderData.paymentStatus === "string"
          ? orderData.paymentStatus
          : "unpaid",
    };
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const query = await searchParams;

  const user = await getCurrentUser();

  const orderStatus =
    user && query.order
      ? await getOrderPaymentStatus(query.order, user.id)
      : null;

  const isPaid = orderStatus?.paymentStatus === "paid";

  return (
    <Container>
      <ClearCartOnMount />

      <section className="mx-auto max-w-2xl py-20 text-center">
        <h1 className="text-4xl font-bold">
          {isPaid
            ? "Payment confirmed"
            : "Payment is being confirmed"}
        </h1>

        <p className="mt-4 text-gray-600">
          {isPaid
            ? "Thank you for your purchase. Your digital download is now available in your account."
            : "Your order has been created. Stripe is confirming your payment. If the download is not available yet, please refresh your orders page in a few seconds."}
        </p>

        {query.order && (
          <p className="mt-4 text-sm text-gray-500">
            Order ID: {query.order}
          </p>
        )}

        {orderStatus && (
          <p className="mt-2 text-sm text-gray-500">
            Status: {orderStatus.status} / {orderStatus.paymentStatus}
          </p>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href={`/${locale}/account/orders`}
            className="rounded-xl border px-6 py-3 transition hover:bg-gray-100"
          >
            View Orders
          </Link>

          <Link
            href={`/${locale}/account/downloads`}
            className="rounded-xl border px-6 py-3 transition hover:bg-gray-100"
          >
            View Downloads
          </Link>

          <Link
            href={`/${locale}/portfolio`}
            className="rounded-xl border px-6 py-3 transition hover:bg-gray-100"
          >
            Continue browsing
          </Link>
        </div>
      </section>
    </Container>
  );
}