import Container from "@/components/layout/Container";
import { getSiteSettings } from "@/lib/getSiteSettings";

export default async function ResumePage() {
  const settings = await getSiteSettings();

  return (
    <Container>
      <section className="py-20">
        <h1 className="mb-10 text-5xl font-bold">
          {settings.resume.title}
        </h1>

        <div className="space-y-8">
          <div className="rounded-xl border p-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Education
            </h2>

            <p className="text-gray-600">
              {settings.resume.education ||
                "Information about education will appear here."}
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Experience
            </h2>

            <p className="text-gray-600">
              {settings.resume.experience ||
                "Information about exhibitions, projects and collaborations."}
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Achievements
            </h2>

            <p className="text-gray-600">
              {settings.resume.achievements ||
                "Awards, publications and notable projects."}
            </p>
          </div>
        </div>

        <div className="mt-10">
          {settings.resume.cvFile ? (
            <a
              href={settings.resume.cvFile.url}
              className="inline-block rounded-xl border px-6 py-3"
              target="_blank"
              rel="noreferrer"
            >
              Download CV
            </a>
          ) : (
            <button className="rounded-xl border px-6 py-3">
              Download CV
            </button>
          )}
        </div>
      </section>
    </Container>
  );
}