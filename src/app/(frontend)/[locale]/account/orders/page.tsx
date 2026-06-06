import AccountLayout from "@/components/account/AccountLayout";
import OrdersClient from "@/components/account/OrdersClient";
import { getCurrentUser } from "@/lib/currentUser";
import { getOrdersByUser } from "@/lib/orders";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

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
    <AccountLayout
      locale={locale}
      title="Orders"
      description="Your purchases and order history."
    >
      <OrdersClient
        orders={orders}
        locale={locale}
      />
    </AccountLayout>
  );
}