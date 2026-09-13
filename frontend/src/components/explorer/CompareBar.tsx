"use client";

import Link from "next/link";
import { Scale, X, ArrowRight } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 animate-in slide-in-from-bottom-5">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-3 sm:p-4 border border-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Komparasi ({compareList.length}/2 PTN)
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium text-white truncate pt-0.5">
              {compareList.filter((item) => item && item.ptn).map((item) => (
                <span
                  key={item.ptn.id_ptn}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5 flex items-center gap-1 shrink-0"
                >
                  <span className="truncate max-w-[120px]">{item.ptn.nama}</span>
                  <button
                    onClick={() => removeFromCompare(item.ptn.id_ptn)}
                    className="text-slate-400 hover:text-white p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-white underline px-1"
          >
            Hapus
          </button>
          <Link
            href="/compare"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <span>Bandingkan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
