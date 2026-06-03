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

export async function sendContactMessage(formData: FormData) {
  const payload = await getPayloadClient();

  const locale = getFormValue(formData, "locale") || "en";

  const name = getFormValue(formData, "name");
  const email = getFormValue(formData, "email");
  const subject = getFormValue(formData, "subject");
  const message = getFormValue(formData, "message");

  if (!name || !email || !subject || !message) {
    redirect(`/${locale}/contact?error=missing-fields`);
  }

  await payload.create({
    collection: "contact-messages",
    data: {
      name,
      email,
      subject,
      message,
      status: "new",
    },
  });

  redirect(`/${locale}/contact?sent=1`);
}