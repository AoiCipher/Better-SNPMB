"use client";

import Link from "next/link";
import { ArrowRight, Check, Scale } from "lucide-react";
import { Jalur, PTN } from "@/types";
import { capitalizeWords } from "@/utils/formatters";

interface PTNTableProps {
  ptns: PTN[];
  jalur: Jalur;
  isComparing: (ptnId: number) => boolean;
  onToggleCompare: (ptn: PTN, jalur: Jalur) => void;
}

export function PTNTable({ ptns, jalur, isComparing, onToggleCompare }: PTNTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4">Kode</th>
              <th className="py-3.5 px-4">Nama PTN</th>
              <th className="py-3.5 px-4">Tipe</th>
              <th className="py-3.5 px-4">Provinsi & Kota</th>
              <th className="py-3.5 px-4">Alamat</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ptns.map((ptn) => {
              const comparing = isComparing(ptn.id_ptn);
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
                <tr key={ptn.id_ptn} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-500">
                    {ptn.kode_ptn || ptn.id_ptn}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <Link
                      href={`/ptn/${ptn.id_ptn}?jalur=${jalur}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {ptn.nama}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        ptn.type.toLowerCase() === "vokasi"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {ptn.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div className="font-medium">{provList.join(", ") || "-"}</div>
                    {kotaList.length > 0 && (
                      <div className="text-xs text-slate-400">{kotaList.join(", ")}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                    {ptn.alamat !== "none" ? ptn.alamat : "-"}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                    <button
                      type="button"
                      onClick={() => onToggleCompare(ptn, jalur)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all inline-flex items-center gap-1 ${
                        comparing
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {comparing ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Dipilih</span>
                        </>
                      ) : (
                        <>
                          <Scale className="w-3 h-3 text-slate-400" />
                          <span>Komparasi</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/ptn/${ptn.id_ptn}?jalur=${jalur}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <span>Detail</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
