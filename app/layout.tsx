import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { GridBg } from "@/components/GridBg";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Queue Hub",
  description: "Your smart, self-hosted watchlist and movie info hub.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative min-h-screen">
        <Providers>
          <ReactQueryDevtools initialIsOpen={false} />
          <Navbar />
          <GridBg />
          <div className="relative z-10">{children}</div>
          <Analytics />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
