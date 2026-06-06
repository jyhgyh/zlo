import AccountLayout from "@/components/account/AccountLayout";
import { getCurrentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function AccountPage({
  params,
}: Props) {
  const { locale } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <AccountLayout
      locale={locale}
      title="Account"
      description="Manage your profile, favorites and purchases."
    >
      <div className="rounded-xl border p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          Profile
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">
              Name
            </p>

            <p>
              {user.name || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p>
              {user.email || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Role
            </p>

            <p>
              {user.role || "user"}
            </p>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}