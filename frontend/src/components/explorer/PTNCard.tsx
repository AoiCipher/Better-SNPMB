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
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 sm:p-5 hover:border-white transition-all flex flex-col justify-between group shadow-md space-y-4">
      <div className="space-y-3">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800">
            KODE: {ptn.kode_ptn || ptn.id_ptn}
          </span>
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-white text-black border-white">
            {ptn.type.toUpperCase()}
          </span>
        </div>

        {/* PTN Title */}
        <h3 className="font-extrabold text-base sm:text-lg text-white leading-snug group-hover:text-zinc-300 transition-colors">
          {ptn.nama}
        </h3>

        {/* Location Info */}
        <div className="space-y-1.5 text-xs text-zinc-400">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-white mt-0.5 shrink-0" />
            <span className="font-medium text-zinc-300">
              {provList.length > 0 ? provList.join(", ") : "Indonesia"}
              {kotaList.length > 0 && ` (${kotaList.join(", ")})`}
            </span>
          </div>

          {ptn.alamat && ptn.alamat !== "none" && (
            <div className="flex items-start gap-2 text-zinc-500">
              <Building2 className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" />
              <span className="line-clamp-2">{ptn.alamat}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-zinc-900 flex items-center gap-2">
        <Link
          href={`/ptn/${ptn.id_ptn}?jalur=${jalur}`}
          className="flex-1 px-3.5 py-2.5 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98"
        >
          <span>Detail Prodi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => onToggleCompare(ptn, jalur)}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 ${
            isComparing
              ? "bg-zinc-900 border-white text-white"
              : "bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
          }`}
          title="Bandingkan PTN ini"
        >
          {isComparing ? (
            <>
              <Check className="w-4 h-4 text-white stroke-[2.5]" />
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
