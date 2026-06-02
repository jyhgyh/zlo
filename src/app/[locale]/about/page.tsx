import Container from "@/components/layout/Container";

export default function AboutPage() {
  return (
    <Container>
      <section className="py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Photo Placeholder */}

          <div className="flex items-center justify-center">
            <div className="flex h-[500px] w-full items-center justify-center rounded-2xl border bg-gray-100 text-gray-400">
              Artist Photo
            </div>
          </div>

          {/* Content */}

          <div>
            <h1 className="mb-6 text-5xl font-bold">
              About Me
            </h1>

            <p className="mb-4 text-gray-600">
              This section will contain the artist
              biography managed through Payload CMS.
            </p>

            <p className="mb-4 text-gray-600">
              Here visitors can learn more about
              artistic background, inspiration,
              techniques, exhibitions and creative
              journey.
            </p>

            <p className="text-gray-600">
              All content will later be editable
              through the admin panel.
            </p>
          </div>
        </div>
      </section>
    </Container>
  );
}