import { cookies, headers } from "next/headers";

type CurrentUser = {
  id: string | number;
  email?: string;
  name?: string;
  role?: "user" | "admin";
} | null;

function getBaseUrl(host: string) {
  const isLocalhost =
    host.includes("localhost") ||
    host.includes("127.0.0.1");

  const protocol = isLocalhost ? "http" : "https";

  return `${protocol}://${host}`;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const headersList = await headers();
  const cookiesStore = await cookies();

  const host = headersList.get("host");

  if (!host) {
    return null;
  }

  const cookieHeader = cookiesStore.toString();

  if (!cookieHeader) {
    return null;
  }

  const response = await fetch(`${getBaseUrl(host)}/api/users/me`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (!data?.user) {
    return null;
  }

  return data.user;
}