import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fellacoo Web",
  description: "AI website builder and conversion engine."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}