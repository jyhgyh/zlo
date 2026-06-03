// src/app/(frontend)/layout.tsx

import React from "react";
import "../globals.css";

export const metadata = {
  title: "Zlata Portfolio",
  description: "Artist & Illustrator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}