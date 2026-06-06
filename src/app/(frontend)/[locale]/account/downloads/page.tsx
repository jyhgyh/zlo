import AccountLayout from "@/components/account/AccountLayout";
import DownloadsClient from "@/components/account/DownloadsClient";
import { getCurrentUser } from "@/lib/currentUser";
import { getDownloadsByUser } from "@/lib/downloads";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

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
    <AccountLayout
      locale={locale}
      title="Downloads"
      description="Your purchased digital artworks."
    >
      <DownloadsClient
        downloads={downloads}
        locale={locale}
      />
    </AccountLayout>
  );
}