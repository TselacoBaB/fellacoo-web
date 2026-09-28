import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/lib/state/app-store";
import { AuthStateProvider } from "@/lib/state/auth-store";

export const metadata: Metadata = {
  title: "Fellacoo Web",
  description: "The business website and operating platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthStateProvider>
          <AppStateProvider>{children}</AppStateProvider>
        </AuthStateProvider>
      </body>
    </html>
  );
}
