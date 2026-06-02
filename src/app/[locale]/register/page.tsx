import Container from "@/components/layout/Container";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <Container>
      <section className="mx-auto max-w-md py-20">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Register
        </h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-xl border p-3"
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full rounded-xl border p-3"
          />

          <button
            type="submit"
            className="w-full rounded-xl border px-6 py-3"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/en/login"
            className="text-gray-500 hover:underline"
          >
            Already have an account?
          </Link>
        </div>
      </section>
    </Container>
  );
}