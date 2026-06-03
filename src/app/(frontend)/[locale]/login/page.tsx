import Container from "@/components/layout/Container";
import Link from "next/link";
import LoginForm from "./LoginForm";

type Props = {
  params: Promise<{
    locale: string;
  }>;

  searchParams: Promise<{
    registered?: string;
  }>;
};

export default async function LoginPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const query = await searchParams;

  const isRegistered = query.registered === "1";

  return (
    <Container>
      <section className="mx-auto max-w-md py-20">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Login
        </h1>

        {isRegistered && (
          <div className="mb-6 rounded-xl border p-4 text-green-700">
            Account created successfully. You can now log in.
          </div>
        )}

        <LoginForm locale={locale} />

        <div className="mt-6 text-center">
          <Link
            href={`/${locale}/register`}
            className="text-gray-500 hover:underline"
          >
            Create account
          </Link>
        </div>
      </section>
    </Container>
  );
}