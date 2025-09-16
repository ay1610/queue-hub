import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
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
          <footer
            className="w-full mt-8 py-4 px-4 flex flex-col items-center text-xs sm:text-sm border-t border-sky-200 dark:border-sky-800 bg-slate-50 dark:bg-[#0d253f]"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left">
              <Image src="/tmdb_logo.svg" alt="TMDB Logo" height={24} width={24} className="h-6 w-6 flex-shrink-0" />
              <span className="text-slate-700 dark:text-white drop-shadow-sm">
                This application uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
              </span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
