import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    <html lang="id" className="h-full dark">
      <body className="min-h-screen flex flex-col antialiased bg-black text-white selection:bg-white selection:text-black">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
