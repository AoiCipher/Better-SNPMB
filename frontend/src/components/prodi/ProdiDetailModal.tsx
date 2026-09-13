"use client";

import { useState } from "react";
import { X, Award, Users, UserCheck, Percent, Info, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Prodi } from "@/types";
import { formatNumber, formatPercent, getChanceBadgeColor, getChanceDescription } from "@/utils/formatters";

interface ProdiDetailModalProps {
  prodi: Prodi | null;
  ptnName: string;
  jalur: string;
  onClose: () => void;
}

export function ProdiDetailModal({ prodi, ptnName, jalur, onClose }: ProdiDetailModalProps) {
  const [activeProvYear, setActiveProvYear] = useState<string>("all");

  if (!prodi) return null;

  const history = prodi.history_daya_tampung || [];
  const latestHistory = history.length > 0 ? history[history.length - 1] : null;

  // Process history_peminat_provinsi
  const rawProvMap = prodi.history_peminat_provinsi || {};
  const availableYears = Array.from(
    new Set(
      Object.values(rawProvMap).flatMap((yearMap) => Object.keys(yearMap))
    )
  ).sort((a, b) => Number(b) - Number(a));

  // Transform provMap into array of { province, total, yearValues }
  const provStats = Object.entries(rawProvMap)
    .map(([provName, yearMap]) => {
      const yearVal = activeProvYear === "all"
        ? Object.values(yearMap).reduce((acc, curr) => acc + (curr || 0), 0)
        : yearMap[activeProvYear] || 0;

      return {
        provinsi: provName,
        peminat: yearVal,
      };
    })
    .filter((item) => item.peminat > 0)
    .sort((a, b) => b.peminat - a.peminat)
    .slice(0, 10); // Top 10 provinces

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-zinc-950 rounded-3xl border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl space-y-6 p-5 sm:p-7 relative my-auto text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b border-zinc-900 pb-4 pr-12">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-black">
              {prodi.jenjang}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-zinc-900 text-zinc-300 border border-zinc-800 uppercase">
              JALUR {jalur.toUpperCase()}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              ID PRODI: {prodi.id_prodi}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
            {prodi.nama}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-zinc-400">
            {ptnName}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-black border border-zinc-800 rounded-2xl p-3.5 space-y-1">
            <div className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-white" />
              <span>Daya Tampung</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-white">
              {formatNumber(prodi.daya_tampung)}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">Kuota Saat Ini</div>
          </div>

          <div className="bg-black border border-zinc-800 rounded-2xl p-3.5 space-y-1">
            <div className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-white" />
              <span>Peminat Terbaru</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-white">
              {latestHistory ? formatNumber(latestHistory.peminat) : "-"}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">
              Tahun {latestHistory ? latestHistory.tahun : "-"}
            </div>
          </div>

          <div className="bg-black border border-zinc-800 rounded-2xl p-3.5 space-y-1">
            <div className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-white" />
              <span>Diterima Terbaru</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-white">
              {latestHistory ? formatNumber(latestHistory.terima) : "-"}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">
              {latestHistory ? `${formatPercent(latestHistory.chance)} peluang` : "-"}
            </div>
          </div>

          <div className="bg-black border border-zinc-800 rounded-2xl p-3.5 space-y-1">
            <div className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-white" />
              <span>Peluang 5 Tahun</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-white">
              {formatPercent(prodi.chance_5_year)}
            </div>
            <div className="text-[11px]">
              <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] border ${getChanceBadgeColor(prodi.chance_5_year)}`}>
                {getChanceDescription(prodi.chance_5_year)}
              </span>
            </div>
          </div>
        </div>

        {/* Predictive Warning Banner */}
        <div className="bg-black border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-white mt-0.5 shrink-0" />
          <p>
            <strong className="text-white">Catatan Keketatan:</strong> Persentase peluang/keketatan dihitung murni dari data histori peminat dan kuota tahun-tahun sebelumnya. Data ini <strong className="text-white underline">BUKAN jaminan atau prediksi kelulusan seleksi</strong>.
          </p>
        </div>

        {/* Historical Trend Chart (Recharts Monochrome) */}
        {history.length > 0 && (
          <div className="bg-black border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-sm">
            <h3 className="font-mono font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
              <span>HISTORI DAYA TAMPUNG & PEMINAT ({history.map((h) => h.tahun).join(", ")})</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="tahun" tick={{ fontSize: 12, fill: "#a1a1aa" }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#a1a1aa" }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#a1a1aa" }} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#000000", borderRadius: "12px", border: "1px solid #3f3f46", fontSize: "12px", color: "#ffffff" }}
                    formatter={(val, name) => {
                      if (name === "Peluang (%)") return [`${val}%`, name];
                      return [formatNumber(Number(val)), name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px", color: "#ffffff" }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="peminat"
                    name="Jumlah Peminat"
                    stroke="#ffffff"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#ffffff" }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="daya_tampung"
                    name="Daya Tampung"
                    stroke="#a1a1aa"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="chance"
                    name="Peluang (%)"
                    stroke="#71717a"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* History Peminat Provinsi Section */}
        <div className="bg-black border border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-mono font-bold text-white text-xs uppercase tracking-widest">
                STATISTIK ASAL PROVINSI PEMINAT
              </h3>
              <p className="text-xs text-zinc-400">
                Top 10 provinsi pendaftar tertinggi berdasarkan catatan histori
              </p>
            </div>

            {/* Year Filter */}
            {availableYears.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-500 font-mono">Tahun:</span>
                <button
                  onClick={() => setActiveProvYear("all")}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                    activeProvYear === "all"
                      ? "bg-white text-black"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Semua
                </button>
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setActiveProvYear(yr)}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                      activeProvYear === yr
                        ? "bg-white text-black"
                        : "bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {provStats.length === 0 ? (
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-center text-xs text-zinc-400 space-y-1">
              <AlertTriangle className="w-5 h-5 text-white mx-auto" />
              <p className="font-bold text-white">Tidak ada catatan data statistik provinsi</p>
              <p>Sumber data tidak memiliki catatan nilai pendaftar provinsi untuk tahun ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={provStats} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                      dataKey="provinsi"
                      tick={{ fontSize: 10, fill: "#a1a1aa" }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#000000", borderRadius: "10px", fontSize: "12px", border: "1px solid #3f3f46", color: "#ffffff" }}
                      formatter={(val) => [formatNumber(Number(val)), "Jumlah Peminat"]}
                    />
                    <Bar dataKey="peminat" fill="#ffffff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                {provStats.map((item, idx) => (
                  <div
                    key={item.provinsi}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800"
                  >
                    <span className="font-medium text-zinc-300">
                      <strong className="font-mono text-white mr-1.5">#{idx + 1}</strong>
                      {item.provinsi}
                    </span>
                    <span className="font-bold text-white">
                      {formatNumber(item.peminat)} peminat
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
