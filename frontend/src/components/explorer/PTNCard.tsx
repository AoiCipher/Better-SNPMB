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

  const ptnTypeBadge =
    ptn.type.toLowerCase() === "vokasi"
      ? "bg-purple-50 text-purple-700 border-purple-200"
      : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="space-y-3">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            Kode: {ptn.kode_ptn || ptn.id_ptn}
          </span>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${ptnTypeBadge}`}>
            {ptn.type.toUpperCase()}
          </span>
        </div>

        {/* PTN Title */}
        <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
          {ptn.nama}
        </h3>

        {/* Location Info */}
        <div className="space-y-1 text-xs text-slate-600">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="font-medium text-slate-700">
              {provList.length > 0 ? provList.join(", ") : "Indonesia"}
              {kotaList.length > 0 && ` (${kotaList.join(", ")})`}
            </span>
          </div>

          {ptn.alamat && ptn.alamat !== "none" && (
            <div className="flex items-start gap-1.5 text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span className="line-clamp-2">{ptn.alamat}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
        <Link
          href={`/ptn/${ptn.id_ptn}?jalur=${jalur}`}
          className="flex-1 px-3 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Detail Program</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => onToggleCompare(ptn, jalur)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            isComparing
              ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
          title="Bandingkan PTN ini"
        >
          {isComparing ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Dipilih</span>
            </>
          ) : (
            <>
              <Scale className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Bandingkan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
