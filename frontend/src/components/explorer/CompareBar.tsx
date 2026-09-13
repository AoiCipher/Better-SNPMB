"use client";

import Link from "next/link";
import { Scale, X, ArrowRight } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 animate-in slide-in-from-bottom-5">
      <div className="bg-zinc-950 text-white rounded-2xl shadow-2xl p-3 sm:p-4 border border-zinc-700 flex items-center justify-between gap-3 backdrop-blur-xl">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shrink-0 font-bold">
            <Scale className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              KOMPARASI ({compareList.length}/2 PTN)
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium text-white truncate pt-0.5 custom-scrollbar">
              {compareList.filter((item) => item && item.ptn).map((item) => (
                <span
                  key={item.ptn.id_ptn}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shrink-0"
                >
                  <span className="truncate max-w-[110px] font-semibold">{item.ptn.nama}</span>
                  <button
                    onClick={() => removeFromCompare(item.ptn.id_ptn)}
                    className="text-zinc-400 hover:text-white p-0.5"
                    aria-label="Hapus dari komparasi"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs font-mono text-zinc-400 hover:text-white underline px-1"
          >
            Hapus
          </button>
          <Link
            href="/compare"
            className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <span>Bandingkan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
