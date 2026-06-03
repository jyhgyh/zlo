import Container from "@/components/layout/Container";
import Link from "next/link";
import { registerUser } from "./actions";

type Props = {
  params: Promise<{
    locale: string;
  }>;

  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "missing-fields") {
    return "Please fill in all required fields.";
  }

  if (error === "password-mismatch") {
    return "Passwords do not match.";
  }

  if (error === "create-failed") {
    return "Could not create account. This email may already be used.";
  }

  return "";
}

export default async function RegisterPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const query = await searchParams;

  const errorMessage = getErrorMessage(query.error);

  return (
    <Container>
      <section className="mx-auto max-w-md py-20">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Register
        </h1>

        {errorMessage && (
          <div className="mb-6 rounded-xl border p-4 text-red-700">
            {errorMessage}
          </div>
        )}

        <form
          action={registerUser}
          className="space-y-4"
        >
          <input
            type="hidden"
            name="locale"
            value={locale}
          />

          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full rounded-xl border p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded-xl border p-3"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full rounded-xl border p-3"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full rounded-xl border p-3"
            required
          />

          <button
            type="submit"
            className="w-full rounded-xl border px-6 py-3 transition hover:bg-gray-100"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href={`/${locale}/login`}
            className="text-gray-500 hover:underline"
          >
            Already have an account?
          </Link>
        </div>
      </section>
    </Container>
  );
}