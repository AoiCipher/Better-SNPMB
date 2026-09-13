"use client";

import { Suspense, useEffect, useState } from "react";
import { Download, LayoutGrid, LayoutList, RefreshCw, AlertCircle, SearchX } from "lucide-react";
import { fetchPTNs } from "@/api/client";
import { FilterBar } from "@/components/explorer/FilterBar";
import { PTNCard } from "@/components/explorer/PTNCard";
import { PTNTable } from "@/components/explorer/PTNTable";
import { CompareBar } from "@/components/explorer/CompareBar";
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Eksplorasi Data PTN {jalur.toUpperCase()}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Menampilkan daftar Perguruan Tinggi Negeri sesuai filter lokasi dan nama kampus.
          </p>
        </div>

        {/* Export Excel Button */}
        {ptns.length > 0 && !isLoading && (
          <button
            onClick={handleExportExcel}
            className="self-start sm:self-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
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
        <div className="text-xs sm:text-sm font-semibold text-slate-700">
          {isLoading ? (
            <span className="flex items-center gap-2 text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Memuat data...
            </span>
          ) : (
            <span>
              Ditemukan <strong className="text-blue-600">{ptns.length}</strong> Perguruan Tinggi
            </span>
          )}
        </div>

        {/* Grid vs Table View Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
            title="Tampilan Kartu"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
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
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-slate-200 rounded-md" />
                <div className="h-4 w-16 bg-slate-200 rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
              <div className="space-y-2">
                <div className="h-3 w-1/2 bg-slate-200 rounded-md" />
                <div className="h-3 w-2/3 bg-slate-200 rounded-md" />
              </div>
              <div className="h-9 w-full bg-slate-200 rounded-xl pt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-red-900 text-base">Gagal Mengambil Data</h3>
          <p className="text-xs sm:text-sm text-red-700 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => setFilters({ jalur, provinsi, kota, ptn })}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      ) : ptns.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <SearchX className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Tidak Ada PTN Ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Tidak ada data Perguruan Tinggi Negeri yang cocok dengan kata kunci filter lokasi atau nama kampus tersebut.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors"
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

      {/* Floating Compare Bar */}
      <CompareBar />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-medium">
          Loading explorer...
        </div>
      }
    >
      <SearchExplorerContent />
    </Suspense>
  );
}
