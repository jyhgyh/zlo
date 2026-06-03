"use client";

import { useRouter } from "next/navigation";

type LogoutButtonProps = {
  locale: string;
};

export default function LogoutButton({
  locale,
}: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/users/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push(`/${locale}/login`);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border px-4 py-2"
    >
      Logout
    </button>
  );
}