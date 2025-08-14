import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { GridBg } from "@/components/GridBg";

export const metadata: Metadata = {
  title: "Queue Hub",
  description: "Your smart, self-hosted watchlist and movie info hub.",
  icons: {
    icon: "/book-marked.svg",
  },
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
          <Navbar />
          <GridBg />
          <div className="relative z-10">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
