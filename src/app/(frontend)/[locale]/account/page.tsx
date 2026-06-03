import Container from "@/components/layout/Container";
import LogoutButton from "@/components/layout/LogoutButton";
import { getCurrentUser } from "@/lib/currentUser";
import Link from "next/link";
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
    <Container>
      <section className="py-20">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Account
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your profile, favorites and purchases.
            </p>
          </div>

          <LogoutButton locale={locale} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-xl border p-5">
            <nav className="space-y-3">
              <Link
                href={`/${locale}/account`}
                className="block rounded-lg border px-4 py-2"
              >
                Profile
              </Link>

              <Link
                href={`/${locale}/account/favorites`}
                className="block rounded-lg border px-4 py-2"
              >
                Favorites
              </Link>

              <Link
                href={`/${locale}/account/orders`}
                className="block rounded-lg border px-4 py-2"
              >
                Orders
              </Link>
            </nav>
          </aside>

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
        </div>
      </section>
    </Container>
  );
}