import Link from "next/link";
import { ExternalLink, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">
                SNPMB<span className="text-blue-400">Explorer</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explorer data daya tampung, jumlah peminat, dan keketatan perguruan tinggi negeri (PTN) jalur SNBP & SNBT di Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Akses Cepat
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/search?jalur=snbp" className="hover:text-white transition-colors">
                  Data PTN SNBP
                </Link>
              </li>
              <li>
                <Link href="/search?jalur=snbt" className="hover:text-white transition-colors">
                  Data PTN SNBT
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Komparasi PTN
                </Link>
              </li>
            </ul>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-400 text-xs uppercase tracking-wider">
              Pernyataan Tidak Resmi
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data pada website ini berasal dari API tidak resmi dan website ini tidak berafiliasi dengan atau merupakan bagian dari SNPMB. Data hanya untuk eksplorasi dan informasi. Selalu verifikasi informasi penting melalui sumber resmi SNPMB.
            </p>
            <div className="pt-1">
              <a
                href="https://snpmb.id/snbp/daya-tampung-snbp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium underline"
              >
                Website Resmi SNPMB <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SNPMBExplorer. Dibuat untuk tujuan edukasi & eksplorasi data.</p>
          <p className="text-[11px]">Tidak menjamin kelulusan seleksi PTN.</p>
        </div>
      </div>
    </footer>
  );
}
