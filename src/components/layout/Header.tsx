import Link from "next/link";
import Container from "./Container";

export default function Header() {
  const locale = "en";

  return (
    <header className="border-b bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href={`/${locale}`}
            className="text-xl font-bold"
          >
            ZLATA
          </Link>

          <nav className="flex items-center gap-6">
            <Link href={`/${locale}/portfolio`}>
              Portfolio
            </Link>

            <Link href={`/${locale}/about`}>
              About
            </Link>

            <Link href={`/${locale}/contact`}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href={`/${locale}/cart`}>
              Cart
            </Link>

            <Link href={`/${locale}/account`}>
              Account
            </Link>

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