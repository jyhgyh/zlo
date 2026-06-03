import Container from "@/components/layout/Container";
import { getSiteSettings } from "@/lib/getSiteSettings";

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <Container>
      <section className="py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex items-center justify-center">
            {settings.about.image ? (
              <img
                src={settings.about.image.url}
                alt={settings.about.image.alt}
                className="h-[500px] w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-[500px] w-full items-center justify-center rounded-2xl border bg-gray-100 text-gray-400">
                Artist Photo
              </div>
            )}
          </div>

          <div>
            <h1 className="mb-6 text-5xl font-bold">
              {settings.about.title}
            </h1>

            <div className="space-y-4 text-gray-600">
              {settings.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}