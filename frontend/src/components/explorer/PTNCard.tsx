"use client";

import Link from "next/link";
import { Building2, MapPin, Scale, ArrowRight, Check } from "lucide-react";
import { Jalur, PTN } from "@/types";
import { capitalizeWords } from "@/utils/formatters";

interface PTNCardProps {
  ptn: PTN;
  jalur: Jalur;
  isComparing: boolean;
  onToggleCompare: (ptn: PTN, jalur: Jalur) => void;
}

export function PTNCard({ ptn, jalur, isComparing, onToggleCompare }: PTNCardProps) {
  // Extract provinces and cities
  const provList = Array.from(
    new Set(
      ptn.provinsi
        .map((p) => capitalizeWords(p.nama_prov1))
        .filter((p) => p !== "-")
    )
  );

  const kotaList = Array.from(
    new Set(
      ptn.provinsi
        .map((p) => capitalizeWords(p.nama_kota))
        .filter((k) => k !== "-")
    )
  );

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 sm:p-5 hover:border-slate-400 dark:hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-sm dark:shadow-md space-y-4">
      <div className="space-y-3">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-800">
            KODE: {ptn.kode_ptn || ptn.id_ptn}
          </span>
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white">
            {ptn.type.toUpperCase()}
          </span>
        </div>

        {/* PTN Title */}
        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors">
          {ptn.nama}
        </h3>

        {/* Location Info */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-900 dark:text-white mt-0.5 shrink-0" />
            <span className="font-medium text-slate-800 dark:text-zinc-300">
              {provList.length > 0 ? provList.join(", ") : "Indonesia"}
              {kotaList.length > 0 && ` (${kotaList.join(", ")})`}
            </span>
          </div>

          {ptn.alamat && ptn.alamat !== "none" && (
            <div className="flex items-start gap-2 text-slate-500 dark:text-zinc-500">
              <Building2 className="w-4 h-4 text-slate-400 dark:text-zinc-600 mt-0.5 shrink-0" />
              <span className="line-clamp-2">{ptn.alamat}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-900 flex items-center gap-2">
        <Link
          href={`/ptn/${ptn.id_ptn}?jalur=${jalur}`}
          className="flex-1 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98"
        >
          <span>Detail Prodi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => onToggleCompare(ptn, jalur)}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 ${
            isComparing
              ? "bg-slate-200 dark:bg-zinc-900 border-slate-900 dark:border-white text-slate-900 dark:text-white"
              : "bg-slate-50 dark:bg-black border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700"
          }`}
          title="Bandingkan PTN ini"
        >
          {isComparing ? (
            <>
              <Check className="w-4 h-4 text-slate-900 dark:text-white stroke-[2.5]" />
              <span className="font-mono">Dipilih</span>
            </>
          ) : (
            <>
              <Scale className="w-4 h-4" />
              <span className="font-mono">Bandingkan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
