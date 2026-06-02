import Container from "@/components/layout/Container";

export default function ForgotPasswordPage() {
  return (
    <Container>
      <section className="mx-auto max-w-md py-20">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Forgot Password
        </h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border p-3"
          />

          <button
            type="submit"
            className="w-full rounded-xl border px-6 py-3"
          >
            Reset Password
          </button>
        </form>
      </section>
    </Container>
  );
}