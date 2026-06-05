import Container from "@/components/layout/Container";
import CheckoutClient from "@/components/cart/CheckoutClient";
import { getCurrentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
  }>;

  searchParams: Promise<{
    error?: string;
    cancelled?: string;
  }>;
};

export default async function CheckoutPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const query = await searchParams;

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <Container>
      <section className="py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Confirm your order details and proceed to payment.
          </p>
        </div>

        <CheckoutClient
          locale={locale}
          userEmail={user.email}
          userName={user.name}
          error={query.error}
          cancelled={query.cancelled}
        />
      </section>
    </Container>
  );
}