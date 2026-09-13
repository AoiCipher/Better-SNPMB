import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Explorer Data PTN SNBP & SNBT Indonesia | SNPMBExplorer",
  description:
    "Eksplorasi data daya tampung, jumlah peminat, keketatan, dan statistik asal provinsi PTN jalur SNBP dan SNBT secara lengkap dan fleksibel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
