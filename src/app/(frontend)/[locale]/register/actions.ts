"use server";

import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function registerUser(formData: FormData) {
  const payload = await getPayloadClient();

  const locale = getFormValue(formData, "locale") || "en";

  const name = getFormValue(formData, "name");
  const email = getFormValue(formData, "email");
  const password = getFormValue(formData, "password");
  const confirmPassword = getFormValue(formData, "confirmPassword");

  if (!email || !password || !confirmPassword) {
    redirect(`/${locale}/register?error=missing-fields`);
  }

  if (password !== confirmPassword) {
    redirect(`/${locale}/register?error=password-mismatch`);
  }

  try {
    await payload.create({
      collection: "users",
      data: {
        name,
        email,
        password,
      },
    });
  } catch {
    redirect(`/${locale}/register?error=create-failed`);
  }

  redirect(`/${locale}/login?registered=1`);
}