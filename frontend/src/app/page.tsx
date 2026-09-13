"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  BookOpen,
  BarChart3,
  Scale,
  Sparkles,
  ArrowRight,
  School,
  Building2,
  Download,
  Filter,
} from "lucide-react";
import { DisclaimerAlert } from "@/components/layout/DisclaimerAlert";

export default function HomePage() {
  const router = useRouter();
  const [quickSearch, setQuickSearch] = useState("");
  const [selectedJalur, setSelectedJalur] = useState<"snbp" | "snbt">("snbp");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) {
      router.push(`/search?jalur=${selectedJalur}`);
      return;
    }
    router.push(`/search?jalur=${selectedJalur}&ptn=${encodeURIComponent(quickSearch.trim())}`);
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {/* Hero Section - Super Mobile Friendly Monochrome */}
      <section className="relative rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-12 overflow-hidden shadow-2xl space-y-6">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-white text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>PLATFORM DATA KAMPUS INDONESIA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            EXPLORER DATA PTN <br />
            <span className="text-zinc-400">SNBP & SNBT 2025</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            Platform eksplorasi rasionalitas daya tampung, historis jumlah peminat, keketatan prodi, hingga sebaran pendaftar per provinsi secara instan.
          </p>

          {/* Quick Search Widget */}
          <form
            onSubmit={handleQuickSearch}
            className="bg-black border border-zinc-800 rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2 shadow-inner"
          >
            <div className="flex bg-zinc-900 rounded-xl p-1 shrink-0 border border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedJalur("snbp")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedJalur === "snbp"
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                SNBP
              </button>
              <button
                type="button"
                onClick={() => setSelectedJalur("snbt")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedJalur === "snbt"
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                SNBT
              </button>
            </div>

            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari PTN (Contoh: UGM, ITB, Universitas Indonesia)..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-500 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 active:scale-98"
            >
              <span>Cari PTN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Mandatory Unofficial Disclaimer Box */}
      <DisclaimerAlert />

      {/* Jalur Selection Cards */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Pilih Jalur Masuk PTN
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Telusuri kuota dan keketatan berdasarkan jalur seleksi resmi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* SNBP Card */}
          <Link
            href="/search?jalur=snbp"
            className="group bg-zinc-950 rounded-2xl border border-zinc-800 p-6 hover:border-white hover:bg-zinc-900/80 transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center group-hover:scale-105 transition-transform font-bold">
                <School className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                  JALUR PRESTASI
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors">
                  SNBP (Seleksi Nasional Berdasarkan Prestasi)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Jalur pemeringkatan nilai rapot & prestasi akademik/non-akademik siswa SMA/SMK/MA seluruh Indonesia.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-bold text-white">
              <span className="font-mono">JELAJAH DATA SNBP</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* SNBT Card */}
          <Link
            href="/search?jalur=snbt"
            className="group bg-zinc-950 rounded-2xl border border-zinc-800 p-6 hover:border-white hover:bg-zinc-900/80 transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center group-hover:scale-105 transition-transform font-bold">
                <BookOpen className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                  JALUR TES UTBK
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors">
                  SNBT (Seleksi Nasional Berdasarkan Tes)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Jalur seleksi berbasis skor UTBK yang menguji Potensi Skolastik, Literasi Bahasa, & Penalaran Matematika.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-bold text-white">
              <span className="font-mono">JELAJAH DATA SNBT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Product Feature Highlights */}
      <section className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Fitur Eksplorasi Data Terlengkap
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Dirancang khusus agar kamu dapat menentukan pilihan PTN dan prodi secara rasional dan terstruktur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-3 shadow-sm hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center font-bold">
              <Filter className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Filter Fleksibel</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cari PTN berdasarkan provinsi saja, kota saja, nama PTN, atau kombinasi tanpa pembatasan urutan filter.
            </p>
          </div>

          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-3 shadow-sm hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Grafik Keketatan 5 Tahun</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Visualisasikan histori daya tampung, peminat, dan persentase kelulusan prodi melalui chart interaktif.
            </p>
          </div>

          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-3 shadow-sm hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Komparasi Hingga 2 PTN</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bandingkan lokasi, daya tampung total, jumlah prodi, dan keketatan antar-PTN secara berdampingan.
            </p>
          </div>

          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-3 shadow-sm hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Statistik Asal Provinsi</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Analisis sebaran pendaftar program studi dari seluruh provinsi Indonesia per tahun pendaftaran.
            </p>
          </div>

          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-3 shadow-sm hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Ekspor Excel Laporan</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unduh hasil pencarian PTN dan daftar prodi lengkap ke format Excel (.xlsx) untuk analisis pribadi.
            </p>
          </div>

          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-3 shadow-sm hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center font-bold">
              <School className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Akademik & Vokasi</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dukungan penuh untuk seluruh Perguruan Tinggi Negeri Akademik (S1) dan Vokasi (D3/D4) se-Indonesia.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
