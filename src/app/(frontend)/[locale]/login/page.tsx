import Container from "@/components/layout/Container";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Container>
      <section className="mx-auto max-w-md py-20">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Login
        </h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border p-3"
          />

          <button
            type="submit"
            className="w-full rounded-xl border px-6 py-3"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/en/register"
            className="text-gray-500 hover:underline"
          >
            Create account
          </Link>
        </div>
      </section>
    </Container>
  );
}