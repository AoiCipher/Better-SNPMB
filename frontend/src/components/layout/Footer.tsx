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
          <p>© {new Date().getFullYear()} Better SNPMB Data Explorer (B-SNPMB). Dibuat untuk tujuan edukasi & eksplorasi data.</p>
          <p className="text-[11px]">Bukan situs resmi BPPP / Kemenristekdikti.</p>
        </div>
      </div>
    </footer>
  );
}
