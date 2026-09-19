"use client";

import { Suspense, useEffect, useState } from "react";
import { Download, LayoutGrid, LayoutList, RefreshCw, AlertCircle, SearchX } from "lucide-react";
import { fetchPTNs } from "@/api/client";
import { FilterBar } from "@/components/explorer/FilterBar";
import { PTNCard } from "@/components/explorer/PTNCard";
import { PTNTable } from "@/components/explorer/PTNTable";
import { DisclaimerAlert } from "@/components/layout/DisclaimerAlert";
import { useSearchState } from "@/hooks/useSearchState";
import { useCompare } from "@/hooks/useCompare";
import { PTN } from "@/types";
import { exportPTNsToExcel } from "@/utils/export";

function SearchExplorerContent() {
  const { jalur, provinsi, kota, ptn, setFilters, clearFilters } = useSearchState();
  const { isComparing, toggleCompare } = useCompare();

  const [ptns, setPtns] = useState<PTN[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchPTNs(jalur, { provinsi, kota })
      .then((data) => {
        if (!isMounted) return;

        // Client-side PTN search filter if user entered PTN keyword/code in query
        let filtered = data;
        if (ptn.trim()) {
          const query = ptn.toLowerCase().trim();
          filtered = data.filter((item) => {
            const nameMatch = item.nama.toLowerCase().includes(query);
            const codeMatch = String(item.kode_ptn).includes(query) || String(item.id_ptn).includes(query);
            return nameMatch || codeMatch;
          });
        }

        setPtns(filtered);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Gagal memuat data PTN. Pastikan backend server aktif.");
        setPtns([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [jalur, provinsi, kota, ptn]);

  const handleExportExcel = () => {
    if (ptns.length === 0) return;
    exportPTNsToExcel(ptns, `data_ptn_${jalur}_${provinsi || "all"}.xlsx`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            EXPLORER KAMPUS NEGERI
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Eksplorasi Data PTN {jalur.toUpperCase()}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
            Menampilkan daftar Perguruan Tinggi Negeri sesuai filter lokasi dan kata kunci pencarian.
          </p>
        </div>

        {/* Export Excel Button */}
        {ptns.length > 0 && !isLoading && (
          <button
            onClick={handleExportExcel}
            className="self-start sm:self-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Excel ({ptns.length})</span>
          </button>
        )}
      </div>

      {/* Filter Control Bar */}
      <FilterBar
        jalur={jalur}
        provinsi={provinsi}
        kota={kota}
        ptn={ptn}
        onFilterChange={setFilters}
        onClear={clearFilters}
        isLoading={isLoading}
      />

      {/* Disclaimer Banner */}
      <DisclaimerAlert compact />

      {/* Controls & Results Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs sm:text-sm font-mono font-bold text-slate-500 dark:text-zinc-400">
          {isLoading ? (
            <span className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Memuat data PTN...
            </span>
          ) : (
            <span>
              DITEMUKAN <strong className="text-slate-900 dark:text-white underline underline-offset-4">{ptns.length}</strong> KAMPUS NEGERI
            </span>
          )}
        </div>

        {/* Grid vs Table View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "grid"
                ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Tampilan Kartu"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "table"
                ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Tampilan Tabel"
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        /* Loading Skeletons */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-5 space-y-4 animate-pulse shadow-sm"
            >
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded-md" />
              <div className="space-y-2">
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                <div className="h-3 w-2/3 bg-slate-200 dark:bg-zinc-800 rounded-md" />
              </div>
              <div className="h-9 w-full bg-slate-200 dark:bg-zinc-800 rounded-xl pt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-white flex items-center justify-center mx-auto border border-slate-200 dark:border-zinc-800">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Gagal Mengambil Data</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => setFilters({ jalur, provinsi, kota, ptn })}
            className="px-5 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold transition-all hover:bg-slate-800 dark:hover:bg-zinc-200 shadow-sm"
          >
            Coba Lagi
          </button>
        </div>
      ) : ptns.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 flex items-center justify-center mx-auto border border-slate-200 dark:border-zinc-800">
            <SearchX className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              Tidak Ada PTN Ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-md mx-auto">
              Tidak ada data Perguruan Tinggi Negeri yang cocok dengan kata kunci filter lokasi atau nama kampus tersebut.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ptns.map((item) => (
            <PTNCard
              key={item.id_ptn}
              ptn={item}
              jalur={jalur}
              isComparing={isComparing(item.id_ptn)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <PTNTable
          ptns={ptns}
          jalur={jalur}
          isComparing={isComparing}
          onToggleCompare={toggleCompare}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-zinc-400 font-mono text-sm">
          Loading explorer...
        </div>
      }
    >
      <SearchExplorerContent />
    </Suspense>
  );
}
