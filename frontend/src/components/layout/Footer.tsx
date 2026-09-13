import Link from "next/link";
import { ExternalLink, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-zinc-400 text-sm mt-auto border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-bold">
                <GraduationCap className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                B-SNPMB<span className="text-zinc-500"> EXPLORER</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Explorer data daya tampung, jumlah peminat, dan keketatan perguruan tinggi negeri (PTN) jalur SNBP & SNBT di Indonesia.
            </p>
            <div className="pt-2">
              <a
                href="https://github.com/AoiCipher/Better-SNPMB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>100% Open Source (Gratis)</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-white font-bold">
              AKSES CEPAT
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Cek Data PTN
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Komparasi PTN
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/AoiCipher/Better-SNPMB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-emerald-400"
                >
                  GitHub Project <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-bold">
              PERNYATAAN TIDAK RESMI
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Data pada website ini berasal dari API tidak resmi dan website ini tidak berafiliasi dengan atau merupakan bagian dari SNPMB. Data hanya untuk eksplorasi dan informasi. Selalu verifikasi informasi penting melalui sumber resmi SNPMB.
            </p>
            <div className="pt-1">
              <a
                href="https://snpmb.id/snbp/daya-tampung-snbp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white hover:text-zinc-300 flex items-center gap-1 font-semibold underline underline-offset-4"
              >
                Website Resmi SNPMB <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} Better SNPMB (B-SNPMB). Proyek Open Source & Nirlaba (Gratis / Tidak Memungut Biaya) untuk Edukasi Siswa di Indonesia.</p>
          <a
            href="https://github.com/AoiCipher/Better-SNPMB"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] hover:text-white transition-colors underline underline-offset-2"
          >
            github.com/AoiCipher/Better-SNPMB
          </a>
        </div>
      </div>
    </footer>
  );
}
