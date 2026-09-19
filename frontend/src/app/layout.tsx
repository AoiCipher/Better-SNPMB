import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareProvider } from "@/hooks/useCompare";
import { CompareBar } from "@/components/explorer/CompareBar";

export const metadata: Metadata = {
  title: "Better SNPMB Data Explorer (B-SNPMB)",
  description:
    "Eksplorasi data daya tampung, jumlah peminat, keketatan, dan statistik asal provinsi PTN jalur SNBP dan SNBT secara lengkap dan fleksibel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var pref = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && pref) || !saved) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[#f2f2f7] dark:bg-black text-slate-900 dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <CompareProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {children}
          </main>
          <Footer />
          <CompareBar />
        </CompareProvider>
      </body>
    </html>
  );
}
