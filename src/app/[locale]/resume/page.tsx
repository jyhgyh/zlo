import Container from "@/components/layout/Container";

export default function ResumePage() {
  return (
    <Container>
      <section className="py-20">
        <h1 className="mb-10 text-5xl font-bold">
          Resume
        </h1>

        <div className="space-y-8">
          <div className="rounded-xl border p-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Education
            </h2>

            <p className="text-gray-600">
              Information about education will
              appear here.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Experience
            </h2>

            <p className="text-gray-600">
              Information about exhibitions,
              projects and collaborations.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Achievements
            </h2>

            <p className="text-gray-600">
              Awards, publications and notable
              projects.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <button className="rounded-xl border px-6 py-3">
            Download CV
          </button>
        </div>
      </section>
    </Container>
  );
}