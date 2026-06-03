import Container from "@/components/layout/Container";
import CartClient from "@/components/cart/CartClient";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CartPage({
  params,
}: Props) {
  const { locale } = await params;

  return (
    <Container>
      <section className="py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Cart
          </h1>

          <p className="mt-2 text-gray-500">
            Review your digital artworks before checkout.
          </p>
        </div>

        <CartClient locale={locale} />
      </section>
    </Container>
  );
}