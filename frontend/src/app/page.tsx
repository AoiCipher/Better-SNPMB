import Link from "next/link";
import {
  Search,
  BookOpen,
  BarChart3,
  Scale,
  Sparkles,
  ArrowRight,
  School,
  Building2,
} from "lucide-react";
import { DisclaimerAlert } from "@/components/layout/DisclaimerAlert";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-12 overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Platform Informasi Daya Tampung PTN</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Explorer Data PTN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              SNBP & SNBT Indonesia
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Akses data lengkap daya tampung, jumlah peminat historis, tingkat keketatan, hingga sebaran statistik provinsi asal calon mahasiswa Perguruan Tinggi Negeri se-Indonesia.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              href="/search?jalur=snbp"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <Search className="w-5 h-5" />
              <span>Eksplor Data SNBP</span>
            </Link>

            <Link
              href="/search?jalur=snbt"
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold text-sm sm:text-base border border-slate-700 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Search className="w-5 h-5 text-emerald-400" />
              <span>Eksplor Data SNBT</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Mandatory Unofficial Disclaimer Box */}
      <DisclaimerAlert />

      {/* Jalur Selection Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Pilih Jalur Masuk PTN
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Telusuri kuota dan keketatan berdasarkan jalur seleksi resmi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SNBP Card */}
          <Link
            href="/search?jalur=snbp"
            className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <School className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                SNBP (Seleksi Nasional Berdasarkan Prestasi)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Jalur pemeringkatan nilai rapot & prestasi akademik/non-akademik siswa SMA/SMK/MA.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Buka Explorer SNBP</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* SNBT Card */}
          <Link
            href="/search?jalur=snbt"
            className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-emerald-500 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                SNBT (Seleksi Nasional Berdasarkan Tes)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Jalur seleksi UTBK yang menguji Potensi Skolastik, Literasi Bahasa, dan Penalaran Matematika.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Buka Explorer SNBT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Product Feature Highlights */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Fitur Eksplorasi Data Terlengkap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dirancang khusus untuk membantu calon mahasiswa menentukan program studi secara rasional dan terstruktur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Filter Fleksibel Independen</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cari PTN berdasarkan provinsi saja, kota saja, nama kampus, atau tanpa filter tanpa pembatasan urutan.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Grafik Keketatan 5 Tahun</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visualisasikan histori daya tampung, jumlah peminat, dan persentase kelulusan program studi secara visual.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Komparasi Hingga 2 PTN</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bandingkan lokasi, daya tampung total, jumlah prodi, dan program studi yang sepadan secara berdampingan.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Statistik Asal Provinsi</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analisis sebaran pendaftar program studi berdasarkan provinsi asal calon mahasiswa.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs sm:col-span-2 lg:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Ekspor Data Excel (.xlsx)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unduh data PTN, daftar prodi, maupun hasil komparasi langsung ke format spreadsheet Excel untuk diolah lebih lanjut.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
