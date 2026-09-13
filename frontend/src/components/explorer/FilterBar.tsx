"use client";

import { useState, useEffect } from "react";
import { Search, X, Filter, RefreshCw } from "lucide-react";
import { Jalur } from "@/types";

interface FilterBarProps {
  jalur: Jalur;
  provinsi: string;
  kota: string;
  ptn: string;
  onFilterChange: (filters: { jalur?: Jalur; provinsi?: string; kota?: string; ptn?: string }) => void;
  onClear: () => void;
  isLoading?: boolean;
}

export function FilterBar({
  jalur,
  provinsi: initialProv,
  kota: initialKota,
  ptn: initialPtn,
  onFilterChange,
  onClear,
  isLoading = false,
}: FilterBarProps) {
  const [inputProv, setInputProv] = useState(initialProv);
  const [inputKota, setInputKota] = useState(initialKota);
  const [inputPtn, setInputPtn] = useState(initialPtn);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    setInputProv(initialProv);
    setInputKota(initialKota);
    setInputPtn(initialPtn);
  }, [initialProv, initialKota, initialPtn]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onFilterChange({
      jalur,
      provinsi: inputProv,
      kota: inputKota,
      ptn: inputPtn,
    });
    setMobileDrawerOpen(false);
  };

  const handleClear = () => {
    setInputProv("");
    setInputKota("");
    setInputPtn("");
    onClear();
    setMobileDrawerOpen(false);
  };

  const isFiltered = !!(inputProv || inputKota || inputPtn || initialProv || initialKota || initialPtn);

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 sm:p-5 shadow-md space-y-4">
      {/* Track Tabs (SNBP vs SNBT) & Mobile Toggle */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800 flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => onFilterChange({ jalur: "snbp" })}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all ${
              jalur === "snbp"
                ? "bg-white text-black shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Jalur SNBP
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ jalur: "snbt" })}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all ${
              jalur === "snbt"
                ? "bg-white text-black shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Jalur SNBT
          </button>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="sm:hidden px-3.5 py-2.5 border border-zinc-800 rounded-xl text-xs font-bold text-white flex items-center gap-2 bg-zinc-900 active:scale-95 transition-all"
        >
          <Filter className="w-4 h-4 text-white" />
          <span>Filter</span>
          {isFiltered && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Desktop / Responsive Inputs Form */}
      <form onSubmit={handleSubmit} className="hidden sm:block space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Province Input */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Provinsi
            </label>
            <input
              type="text"
              value={inputProv}
              onChange={(e) => setInputProv(e.target.value)}
              placeholder="Contoh: Jawa Tengah, DKI Jakarta"
              className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-all"
            />
          </div>

          {/* City / Regency Input */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Kabupaten / Kota
            </label>
            <input
              type="text"
              value={inputKota}
              onChange={(e) => setInputKota(e.target.value)}
              placeholder="Contoh: Banyumas, Bandung"
              className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-all"
            />
          </div>

          {/* PTN Search / Code Input */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Nama / Kode PTN
            </label>
            <input
              type="text"
              value={inputPtn}
              onChange={(e) => setInputPtn(e.target.value)}
              placeholder="Contoh: Soedirman, 351, 1351"
              className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          {isFiltered && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Hapus Filter</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-98"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Cari Data</span>
          </button>
        </div>
      </form>

      {/* Mobile Drawer Filter Dialog */}
      {mobileDrawerOpen && (
        <div className="sm:hidden bg-black p-4 rounded-xl border border-zinc-800 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">
              FILTER PENCARIAN
            </span>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="text-zinc-400 p-1 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
              Provinsi
            </label>
            <input
              type="text"
              value={inputProv}
              onChange={(e) => setInputProv(e.target.value)}
              placeholder="Contoh: Jawa Tengah"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
              Kabupaten / Kota
            </label>
            <input
              type="text"
              value={inputKota}
              onChange={(e) => setInputKota(e.target.value)}
              placeholder="Contoh: Banyumas"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
              Nama / Kode PTN
            </label>
            <input
              type="text"
              value={inputPtn}
              onChange={(e) => setInputPtn(e.target.value)}
              placeholder="Contoh: Soedirman"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-xs font-bold text-zinc-400"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="px-5 py-2.5 bg-white text-black rounded-xl text-xs font-bold shadow-sm"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
