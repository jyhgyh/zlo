import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;

  return (
    <>
      <Header locale={locale} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </>
  );
}