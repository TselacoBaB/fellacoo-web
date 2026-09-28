import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/lib/state/app-store";

export const metadata: Metadata = {
  title: "Fellacoo Web",
  description: "The business website and operating platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
