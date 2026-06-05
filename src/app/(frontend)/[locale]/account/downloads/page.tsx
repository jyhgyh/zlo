import Container from "@/components/layout/Container";
import { getCurrentUser } from "@/lib/currentUser";
import { getDownloadsByUser } from "@/lib/downloads";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

function getCurrencySymbol(currency: "EUR" | "USD") {
  return currency === "USD" ? "$" : "€";
}

export default async function DownloadsPage({
  params,
}: Props) {
  const { locale } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const downloads = await getDownloadsByUser(user.id);

  return (
    <Container>
      <section className="py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Downloads
          </h1>

          <p className="mt-2 text-gray-500">
            Your purchased digital artworks.
          </p>
        </div>

        {downloads.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {downloads.map((item) => (
              <div
                key={`${item.orderId}-${item.artworkId}`}
                className="overflow-hidden rounded-xl border"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      Image
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <Link
                      href={`/${locale}/portfolio/${item.slug}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      {item.title}
                    </Link>

                    <p className="mt-1 text-sm text-gray-500">
                      Purchased artwork
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Order #{item.orderId}
                    </span>

                    <span>
                      {getCurrencySymbol(item.currency)}
                      {item.price}
                    </span>
                  </div>

                  {item.purchasedAt && (
                    <p className="text-sm text-gray-500">
                      Purchased on{" "}
                      {new Date(item.purchasedAt).toLocaleDateString()}
                    </p>
                  )}

                  <a
                    href={`/${locale}/account/orders/download?orderId=${item.orderId}&artworkId=${item.artworkId}`}
                    className="block w-full rounded-xl border px-5 py-3 text-center font-medium transition hover:bg-gray-100"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No downloads yet
            </h2>

            <p className="mt-2 text-gray-500">
              Purchased digital artworks will appear here.
            </p>

            <Link
              href={`/${locale}/portfolio`}
              className="mt-6 inline-block rounded-xl border px-6 py-3 transition hover:bg-gray-100"
            >
              Browse portfolio
            </Link>
          </div>
        )}
      </section>
    </Container>
  );
}