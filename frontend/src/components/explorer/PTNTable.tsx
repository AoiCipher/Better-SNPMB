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
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow-md overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-black border-b border-zinc-800 text-zinc-400 font-mono text-[11px] uppercase tracking-widest">
              <th className="py-4 px-4 font-bold">KODE</th>
              <th className="py-4 px-4 font-bold">NAMA PTN</th>
              <th className="py-4 px-4 font-bold">TIPE</th>
              <th className="py-4 px-4 font-bold">PROVINSI & KOTA</th>
              <th className="py-4 px-4 font-bold">ALAMAT</th>
              <th className="py-4 px-4 text-right font-bold">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
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
                <tr key={ptn.id_ptn} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-400">
                    {ptn.kode_ptn || ptn.id_ptn}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    <Link
                      href={`/ptn/${ptn.id_ptn}?jalur=${jalur}`}
                      className="hover:text-zinc-300 transition-colors"
                    >
                      {ptn.nama}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-white text-black border-white">
                      {ptn.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <div className="font-semibold">{provList.join(", ") || "-"}</div>
                    {kotaList.length > 0 && (
                      <div className="text-xs text-zinc-500">{kotaList.join(", ")}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate">
                    {ptn.alamat !== "none" ? ptn.alamat : "-"}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                    <button
                      type="button"
                      onClick={() => onToggleCompare(ptn, jalur)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all inline-flex items-center gap-1.5 ${
                        comparing
                          ? "bg-zinc-900 border-white text-white"
                          : "bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                      }`}
                    >
                      {comparing ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span className="font-mono">Dipilih</span>
                        </>
                      ) : (
                        <>
                          <Scale className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="font-mono">Komparasi</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/ptn/${ptn.id_ptn}?jalur=${jalur}`}
                      className="px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
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
