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
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Track Tabs (SNBP vs SNBT) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl">
          <button
            type="button"
            onClick={() => onFilterChange({ jalur: "snbp" })}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              jalur === "snbp"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            Jalur SNBP
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ jalur: "snbt" })}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              jalur === "snbt"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            Jalur SNBT
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="sm:hidden px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50"
        >
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter</span>
          {isFiltered && (
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          )}
        </button>
      </div>

      {/* Desktop / Responsive Inputs Form */}
      <form onSubmit={handleSubmit} className="hidden sm:block space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Province Input (Independent) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Provinsi
            </label>
            <input
              type="text"
              value={inputProv}
              onChange={(e) => setInputProv(e.target.value)}
              placeholder="Contoh: Jawa Tengah, DKI Jakarta"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* City / Regency Input (Independent) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kabupaten / Kota
            </label>
            <input
              type="text"
              value={inputKota}
              onChange={(e) => setInputKota(e.target.value)}
              placeholder="Contoh: Banyumas, Bandung"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* PTN Search / Code Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama / Kode / ID PTN
            </label>
            <input
              type="text"
              value={inputPtn}
              onChange={(e) => setInputPtn(e.target.value)}
              placeholder="Contoh: Soedirman, 351, 1351"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          {isFiltered && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Hapus Filter</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
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
        <div className="sm:hidden bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Filter Pencarian
            </span>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="text-slate-500 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Provinsi
            </label>
            <input
              type="text"
              value={inputProv}
              onChange={(e) => setInputProv(e.target.value)}
              placeholder="Contoh: Jawa Tengah"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kabupaten / Kota
            </label>
            <input
              type="text"
              value={inputKota}
              onChange={(e) => setInputKota(e.target.value)}
              placeholder="Contoh: Banyumas"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama / Kode PTN
            </label>
            <input
              type="text"
              value={inputPtn}
              onChange={(e) => setInputPtn(e.target.value)}
              placeholder="Contoh: Soedirman"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 text-xs font-medium text-slate-600"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
