"use client";

import { useState, useMemo } from "react";
import { Search, Download, ArrowUpDown, Filter, Eye } from "lucide-react";
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
      <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama program studi..."
              className="w-full pl-10 pr-3 py-2.5 bg-black border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Jenjang Filter */}
            <div className="flex items-center gap-1.5 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={selectedJenjang}
                onChange={(e) => setSelectedJenjang(e.target.value)}
                className="bg-black text-white font-mono font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">Semua Jenjang</option>
                {jenjangOptions.map((j) => (
                  <option key={j} value={j} className="bg-zinc-900 text-white">
                    {j}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black text-white font-mono font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="capacity" className="bg-zinc-900 text-white">Daya Tampung (Tinggi → Rendah)</option>
                <option value="chance5yr" className="bg-zinc-900 text-white">Peluang 5 Thn (Tinggi → Rendah)</option>
                <option value="name" className="bg-zinc-900 text-white">Nama Prodi (A → Z)</option>
              </select>
            </div>

            {/* Export Excel Button */}
            <button
              onClick={handleExport}
              disabled={filteredList.length === 0}
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor (.xlsx)</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-mono pt-1">
          Menampilkan <strong className="text-white underline underline-offset-2">{filteredList.length}</strong> dari total{" "}
          {prodiList.length} program studi
        </div>
      </div>

      {/* Program Study Cards */}
      {filteredList.length === 0 ? (
        <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-8 text-center text-xs sm:text-sm text-zinc-400 font-mono">
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
                className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 hover:border-white transition-all flex flex-col justify-between space-y-3 group shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-white text-black text-[10px] font-mono font-bold">
                      {prodi.jenjang}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${getChanceBadgeColor(
                        prodi.chance_5_year
                      )}`}
                    >
                      Peluang 5Thn: {formatPercent(prodi.chance_5_year)}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-white leading-snug group-hover:text-zinc-300 transition-colors">
                    {prodi.nama}
                  </h3>

                  {prodi.nama_portofolio && (
                    <div className="text-[11px] font-mono text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800 inline-block font-semibold">
                      Portofolio: {prodi.nama_portofolio}
                    </div>
                  )}
                </div>

                {/* Metrics Footer */}
                <div className="space-y-3 pt-3 border-t border-zinc-900">
                  <div className="grid grid-cols-3 gap-1 text-center text-xs bg-black border border-zinc-800 p-2 rounded-xl">
                    <div>
                      <div className="text-[10px] text-zinc-500 font-mono">Daya Tampung</div>
                      <div className="font-bold text-white">{formatNumber(prodi.daya_tampung)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 font-mono">Peminat Terbaru</div>
                      <div className="font-bold text-white">
                        {latestHistory ? formatNumber(latestHistory.peminat) : "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 font-mono">Diterima Terbaru</div>
                      <div className="font-bold text-zinc-200">
                        {latestHistory ? formatNumber(latestHistory.terima) : "-"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectProdi(prodi)}
                    className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Eye className="w-4 h-4 stroke-[2.2]" />
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
