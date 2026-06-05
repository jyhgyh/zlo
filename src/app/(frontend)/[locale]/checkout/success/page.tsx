import Container from "@/components/layout/Container";
import ClearCartOnMount from "@/components/cart/ClearCartOnMount";
import Link from "next/link";

type Props = {
  params: Promise<{
    locale: string;
  }>;

  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const query = await searchParams;

  return (
    <Container>
      <ClearCartOnMount />

      <section className="mx-auto max-w-2xl py-20 text-center">
        <h1 className="text-4xl font-bold">
          Payment successful
        </h1>

        <p className="mt-4 text-gray-600">
          Thank you for your purchase. Your order has been created
          and your digital download will be available in your account.
        </p>

        {query.order && (
          <p className="mt-4 text-sm text-gray-500">
            Order ID: {query.order}
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