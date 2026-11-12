import Container from "@/components/layout/Container";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { getArtworkBySlug } from "@/lib/getArtworks";
import { isShopArtwork } from "@/lib/artworkVisibility";
import { sendContactMessage } from "./actions";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    sent?: string;
    error?: string;
    artwork?: string;
  }>;
};

export default async function ContactPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = await searchParams;
  const settings = await getSiteSettings();
  const isSent = query.sent === "1";
  const hasError = query.error === "missing-fields";

  // Only public, available physical artworks may be referenced from Shop.
  const slug = typeof query.artwork === "string" && query.artwork.length < 160
    ? query.artwork : "";
  const artwork = slug ? await getArtworkBySlug(slug) : null;
  const painting = artwork?.type === "physical" && isShopArtwork(artwork)
    ? artwork : null;

  return (
    <Container>
      <section className="py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="mb-4 text-5xl font-bold">{settings.contact.title}</h1>
            {settings.contact.description && (
              <p className="mb-8 text-gray-600">{settings.contact.description}</p>
            )}
            {painting && (
              <div className="mb-6 rounded-xl border p-4">
                <p className="font-semibold">Enquiry about: {painting.title}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Physical paintings are arranged directly with the artist. No online payment is taken.
                </p>
              </div>
            )}
            {isSent && (
              <div className="mb-6 rounded-xl border p-4 text-green-700">
                Your message has been sent successfully.
              </div>
            )}
            {hasError && (
              <div className="mb-6 rounded-xl border p-4 text-red-700">
                Please fill in all fields before sending the message.
              </div>
            )}
            <form action={sendContactMessage} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <input type="text" name="name" placeholder="Your Name"
                className="w-full rounded-xl border p-3" required />
              <input type="email" name="email" placeholder="Your Email"
                className="w-full rounded-xl border p-3" required />
              <input type="text" name="subject" placeholder="Subject"
                defaultValue={painting ? `Painting enquiry: ${painting.title}` : ""}
                className="w-full rounded-xl border p-3" required />
              <textarea name="message" rows={6} placeholder="Message"
                defaultValue={painting
                  ? `Hello, I am interested in the original painting “${painting.title}”. Could you tell me about its availability and the purchase arrangements?`
                  : ""}
                className="w-full rounded-xl border p-3" required />
              <button type="submit" className="rounded-xl border px-6 py-3 transition hover:bg-gray-100">
                Send Message
              </button>
            </form>
          </div>
          <div>
            <h2 className="mb-6 text-3xl font-semibold">Contact Information</h2>
            <div className="space-y-4">
              <div className="rounded-xl border p-4">
                <p className="text-sm text-gray-500">Email</p>
                {settings.contact.email ? (
                  <a href={`mailto:${settings.contact.email}`} className="hover:underline">
                    {settings.contact.email}
                  </a>
                ) : <p>Email Placeholder</p>}
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-sm text-gray-500">Instagram</p>
                {settings.contact.instagram ? (
                  <a href={settings.contact.instagram} target="_blank" rel="noreferrer"
                    className="hover:underline">Instagram</a>
                ) : <p>Instagram Placeholder</p>}
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-sm text-gray-500">WhatsApp</p>
                {settings.contact.whatsapp ? (
                  <a href={settings.contact.whatsapp} target="_blank" rel="noreferrer"
                    className="hover:underline">WhatsApp</a>
                ) : <p>WhatsApp Placeholder</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
