import Link from "next/link";
import Container from "./Container";
import { getCurrentUser } from "@/lib/currentUser";

type HeaderProps = {
  locale?: string;
};

export default async function Header({
  locale = "en",
}: HeaderProps) {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href={`/${locale}`}
            className="text-2xl font-bold tracking-wide"
          >
            ZLATA
          </Link>

          <nav className="flex items-center gap-8">
            <Link href={`/${locale}/portfolio`}>
              Portfolio
            </Link>

            <Link href={`/${locale}/about`}>
              About
            </Link>

            <Link href={`/${locale}/contact`}>
              Contact
            </Link>

            <Link href={`/${locale}/resume`}>
              Resume
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href={`/${locale}/account`}
                className="rounded-lg border px-4 py-2"
              >
                Account
              </Link>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="rounded-lg border px-4 py-2"
              >
                Login
              </Link>
            )}

            <div className="flex gap-2 text-sm">
              <Link href="/en">EN</Link>
              <Link href="/fr">FR</Link>
              <Link href="/ru">RU</Link>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}