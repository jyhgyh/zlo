import Container from "@/components/layout/Container";
import LogoutButton from "@/components/layout/LogoutButton";
import Link from "next/link";

type AccountLayoutProps = {
  locale: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AccountLayout({
  locale,
  title,
  description,
  children,
}: AccountLayoutProps) {
  return (
    <Container>
      <section className="py-20">
        <div className="mb-10 flex items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold">
              {title}
            </h1>

            <p className="mt-2 text-gray-500">
              {description}
            </p>
          </div>

          <LogoutButton locale={locale} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-xl border p-5">
            <nav className="space-y-3">
              <Link
                href={`/${locale}/account`}
                className="block rounded-lg border px-4 py-2 transition hover:bg-gray-100"
              >
                Profile
              </Link>

              <Link
                href={`/${locale}/account/favorites`}
                className="block rounded-lg border px-4 py-2 transition hover:bg-gray-100"
              >
                Favorites
              </Link>

              <Link
                href={`/${locale}/account/orders`}
                className="block rounded-lg border px-4 py-2 transition hover:bg-gray-100"
              >
                Orders
              </Link>

              <Link
                href={`/${locale}/account/downloads`}
                className="block rounded-lg border px-4 py-2 transition hover:bg-gray-100"
              >
                Downloads
              </Link>
            </nav>
          </aside>

          <div>
            {children}
          </div>
        </div>
      </section>
    </Container>
  );
}