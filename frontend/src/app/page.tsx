"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  BookOpen,
  BarChart3,
  Scale,
  ArrowRight,
  School,
  Building2,
  Download,
  Filter,
  GraduationCap,
  Layers,
  ChevronRight,
} from "lucide-react";
import { DisclaimerAlert } from "@/components/layout/DisclaimerAlert";

const POPULAR_PTNS = [
  "Universitas Indonesia",
  "Universitas Gadjah Mada",
  "Institut Teknologi Bandung",
  "Universitas Airlangga",
  "Institut Teknologi Sepuluh Nopember",
  "Universitas Diponegoro",
  "IPB University",
  "Universitas Padjadjaran",
];

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

  const handleTagClick = (ptnName: string) => {
    router.push(`/search?jalur=${selectedJalur}&ptn=${encodeURIComponent(ptnName)}`);
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {/* Hero Section */}
      <section className="rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200/90 dark:border-zinc-800 p-6 sm:p-10 lg:p-12 shadow-sm transition-colors space-y-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-200 text-xs font-mono font-medium">
            <GraduationCap className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
            <span>DATABASE SNPMB 2025</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-white">
            Data Daya Tampung & <br />
            <span className="text-slate-500 dark:text-zinc-400">Keketatan PTN 2025</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
            Platform eksplorasi data resmi rasionalitas daya tampung, histori jumlah peminat, keketatan prodi, hingga statistik asal provinsi pendaftar secara transparan.
          </p>
        </div>

        {/* Quick Search Box */}
        <div className="space-y-3">
          <form
            onSubmit={handleQuickSearch}
            className="bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-2 flex flex-col sm:flex-row gap-2"
          >
            {/* Jalur Selector Toggle */}
            <div className="flex bg-slate-200/70 dark:bg-zinc-900 rounded-xl p-1 shrink-0 border border-slate-200/80 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedJalur("snbp")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedJalur === "snbp"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-xs"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                SNBP
              </button>
              <button
                type="button"
                onClick={() => setSelectedJalur("snbt")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedJalur === "snbt"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-xs"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                SNBT
              </button>
            </div>

            {/* Input Field */}
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari universitas (Contoh: UGM, ITB, Universitas Indonesia)..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-hidden focus:border-slate-900 dark:focus:border-white transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 active:scale-[0.98] shadow-xs"
            >
              <span>Cari PTN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Access Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-zinc-400 pt-1">
            <span className="font-medium text-slate-700 dark:text-zinc-300">Popular:</span>
            {POPULAR_PTNS.map((ptn) => (
              <button
                key={ptn}
                type="button"
                onClick={() => handleTagClick(ptn)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-800 transition-colors font-medium text-[11px]"
              >
                {ptn}
              </button>
            ))}
          </div>
        </div>

        {/* Data Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-zinc-900">
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">145+</div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">PTN Akademik & Vokasi</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">3.000+</div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">Program Studi Terdata</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">5 Tahun</div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">Histori Daya Tampung</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">100%</div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">Gratis & Tanpa Login</div>
          </div>
        </div>
      </section>

      {/* Mandatory Unofficial Disclaimer Box */}
      <DisclaimerAlert />

      {/* Jalur Selection Cards */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Pilih Jalur Seleksi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            Telusuri daya tampung dan histori peminat sesuai jalur yang kamu ikuti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* SNBP Card */}
          <Link
            href="/search?jalur=snbp"
            className="group bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-6 hover:border-slate-400 dark:hover:border-zinc-700 transition-all space-y-5 flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
                  <School className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">
                  JALUR PRESTASI
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-zinc-200 transition-colors">
                  SNBP (Seleksi Nasional Berdasarkan Prestasi)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Penilaian berbasis hasil pemeringkatan nilai rapor semester 1-5 dan prestasi akademik maupun non-akademik siswa SMA/SMK/MA.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-600 dark:text-zinc-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
                  Rapor & Prestasi
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
                  Kuota Sekolah
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
                  Keketatan Ratio
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
              <span>Jelajah Data SNBP</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* SNBT Card */}
          <Link
            href="/search?jalur=snbt"
            className="group bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-6 hover:border-slate-400 dark:hover:border-zinc-700 transition-all space-y-5 flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">
                  JALUR TES UTBK
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-zinc-200 transition-colors">
                  SNBT (Seleksi Nasional Berdasarkan Tes)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Seleksi berbasis hasil Ujian Tulis Berbasis Komputer (UTBK) yang menguji TPS, Literasi Bahasa, dan Penalaran Matematika.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-600 dark:text-zinc-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
                  Skor UTBK 7 Subtes
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
                  Histori Peminat 5 Tahun
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
                  Sebaran Provinsi
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
              <span>Jelajah Data SNBT</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Product Feature Highlights */}
      <section className="space-y-6 pt-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Fitur Eksplorasi Data Terlengkap
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            Alat bantu analisis rasionalisasi pilihan PTN dan program studi secara terukur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white flex items-center justify-center font-bold">
              <Filter className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Filter Kombinasi Fleksibel</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Cari PTN berdasarkan wilayah provinsi, kota, atau nama perguruan tinggi tanpa urutan filter yang kaku.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Grafik Keketatan 5 Tahun</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Visualisasikan histori daya tampung, jumlah peminat, dan rasio persentase kelulusan prodi secara interaktif.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Komparasi Hingga 2 PTN</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Bandingkan lokasi, jumlah prodi, serta total kuota antara dua universitas secara berdampingan.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Statistik Asal Provinsi</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Analisis sebaran domisili pendaftar per prodi dari seluruh provinsi Indonesia per tahun seleksi.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Ekspor Laporan Excel</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Unduh hasil pencarian PTN dan rincian prodi lengkap ke format file Excel (.xlsx) untuk analisis pribadi.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Akademik & Vokasi</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Cakupan data lengkap untuk PTN Akademik (S1) serta PTN Vokasi / Politeknik Negeri (D3 & D4).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
