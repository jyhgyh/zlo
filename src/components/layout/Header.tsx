import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/resume">Resume</Link>
        <Link href="/login">Login</Link>
        <Link href="/resume">Resume</Link>
      </nav>
    </header>
  );
}