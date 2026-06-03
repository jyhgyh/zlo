"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  locale: string;
};

export default function LoginForm({
  locale,
}: LoginFormProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const response = await fetch("/api/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    setIsLoading(false);

    if (!response.ok) {
      setError("Invalid email or password.");
      return;
    }

    router.push(`/${locale}/account`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {error && (
        <div className="rounded-xl border p-4 text-red-700">
          {error}
        </div>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full rounded-xl border p-3"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full rounded-xl border p-3"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl border px-6 py-3 transition hover:bg-gray-100 disabled:opacity-50"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}