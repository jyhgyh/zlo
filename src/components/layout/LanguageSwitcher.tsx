import Link from "next/link";

export default function LanguageSwitcher() {
  return (
    <div className="flex gap-2">
      <Link href="/en">EN</Link>
      <Link href="/fr">FR</Link>
      <Link href="/ru">RU</Link>
    </div>
  );
}