"use client";

import { useState, useMemo } from "react";
import { Search, Download, ArrowUpDown, Filter, Eye, Award } from "lucide-react";
import { Prodi } from "@/types";
import { formatNumber, formatPercent, getChanceBadgeColor } from "@/utils/formatters";
import { exportProdiToExcel } from "@/utils/export";

interface ProdiListProps {
  prodiList: Prodi[];
  ptnName: string;
  jalur: string;
  onSelectProdi: (prodi: Prodi) => void;
}

export function ProdiList({ prodiList, ptnName, jalur, onSelectProdi }: ProdiListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJenjang, setSelectedJenjang] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "capacity" | "chance5yr">("capacity");

  // Extract unique jenjang (e.g. S1, D4, D3)
  const jenjangOptions = useMemo(() => {
    return Array.from(new Set(prodiList.map((p) => p.jenjang).filter(Boolean)));
  }, [prodiList]);

  // Filter and sort prodi list
  const filteredList = useMemo(() => {
    return prodiList
      .filter((p) => {
        const nameMatch = p.nama.toLowerCase().includes(searchTerm.toLowerCase().trim());
        const jenjangMatch = selectedJenjang === "all" || p.jenjang === selectedJenjang;
        return nameMatch && jenjangMatch;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.nama.localeCompare(b.nama);
        if (sortBy === "capacity") return b.daya_tampung - a.daya_tampung;
        if (sortBy === "chance5yr") return b.chance_5_year - a.chance_5_year;
        return 0;
      });
  }, [prodiList, searchTerm, selectedJenjang, sortBy]);

  const handleExport = () => {
    exportProdiToExcel(filteredList, ptnName, jalur);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search, Jenjang Filter, Sort, Export */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama program studi..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Jenjang Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedJenjang}
                onChange={(e) => setSelectedJenjang(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Jenjang</option>
                {jenjangOptions.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="capacity">Daya Tampung (Tinggi → Rendah)</option>
                <option value="chance5yr">Peluang 5 Thn (Tinggi → Rendah)</option>
                <option value="name">Nama Prodi (A → Z)</option>
              </select>
            </div>

            {/* Export Excel Button */}
            <button
              onClick={handleExport}
              disabled={filteredList.length === 0}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor (.xlsx)</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium pt-1">
          Menampilkan <strong className="text-blue-600">{filteredList.length}</strong> dari total{" "}
          {prodiList.length} program studi
        </div>
      </div>

      {/* Program Study Cards / Table */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs sm:text-sm text-slate-500">
          Tidak ada program studi yang cocok dengan kata kunci pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((prodi) => {
            const latestHistory =
              prodi.history_daya_tampung && prodi.history_daya_tampung.length > 0
                ? prodi.history_daya_tampung[prodi.history_daya_tampung.length - 1]
                : null;

            return (
              <div
                key={prodi.id_prodi}
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-100">
                      {prodi.jenjang}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getChanceBadgeColor(
                        prodi.chance_5_year
                      )}`}
                    >
                      Peluang 5Thn: {formatPercent(prodi.chance_5_year)}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {prodi.nama}
                  </h3>

                  {prodi.nama_portofolio && (
                    <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60 inline-block font-medium">
                      Portofolio: {prodi.nama_portofolio}
                    </div>
                  )}
                </div>

                {/* Metrics Footer */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-1 text-center text-xs bg-slate-50 p-2 rounded-xl">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Daya Tampung</div>
                      <div className="font-bold text-slate-900">{formatNumber(prodi.daya_tampung)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Peminat Terbaru</div>
                      <div className="font-bold text-slate-900">
                        {latestHistory ? formatNumber(latestHistory.peminat) : "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Diterima Terbaru</div>
                      <div className="font-bold text-emerald-700">
                        {latestHistory ? formatNumber(latestHistory.terima) : "-"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectProdi(prodi)}
                    className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail & Grafik Histori</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
