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
    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-sm dark:shadow-md overflow-hidden transition-colors">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100/80 dark:bg-black border-b border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-widest">
              <th className="py-4 px-4 font-bold">KODE</th>
              <th className="py-4 px-4 font-bold">NAMA PTN</th>
              <th className="py-4 px-4 font-bold">TIPE</th>
              <th className="py-4 px-4 font-bold">PROVINSI & KOTA</th>
              <th className="py-4 px-4 font-bold">ALAMAT</th>
              <th className="py-4 px-4 text-right font-bold">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
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
                <tr key={ptn.id_ptn} className="hover:bg-slate-50/80 dark:hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500 dark:text-zinc-400">
                    {ptn.kode_ptn || ptn.id_ptn}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <Link
                      href={`/ptn/${ptn.id_ptn}?jalur=${jalur}`}
                      className="hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      {ptn.nama}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white">
                      {ptn.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-zinc-300">
                    <div className="font-semibold">{provList.join(", ") || "-"}</div>
                    {kotaList.length > 0 && (
                      <div className="text-xs text-slate-500 dark:text-zinc-500">{kotaList.join(", ")}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-400 max-w-xs truncate">
                    {ptn.alamat !== "none" ? ptn.alamat : "-"}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                    <button
                      type="button"
                      onClick={() => onToggleCompare(ptn, jalur)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all inline-flex items-center gap-1.5 ${
                        comparing
                          ? "bg-slate-200 dark:bg-zinc-900 border-slate-900 dark:border-white text-slate-900 dark:text-white"
                          : "bg-slate-50 dark:bg-black border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      {comparing ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                          <span className="font-mono">Dipilih</span>
                        </>
                      ) : (
                        <>
                          <Scale className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                          <span className="font-mono">Komparasi</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/ptn/${ptn.id_ptn}?jalur=${jalur}`}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                    >
                      <span>Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
