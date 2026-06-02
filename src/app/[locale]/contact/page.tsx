import Container from "@/components/layout/Container";

export default function ContactPage() {
  return (
    <Container>
      <section className="py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}

          <div>
            <h1 className="mb-8 text-5xl font-bold">
              Contact
            </h1>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl border p-3"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full rounded-xl border p-3"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-xl border p-3"
              />

              <textarea
                rows={6}
                placeholder="Message"
                className="w-full rounded-xl border p-3"
              />

              <button
                type="submit"
                className="rounded-xl border px-6 py-3"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}

          <div>
            <h2 className="mb-6 text-3xl font-semibold">
              Contact Information
            </h2>

            <div className="space-y-4">
              <div className="rounded-xl border p-4">
                Email Placeholder
              </div>

              <div className="rounded-xl border p-4">
                Instagram Placeholder
              </div>

              <div className="rounded-xl border p-4">
                WhatsApp Placeholder
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}