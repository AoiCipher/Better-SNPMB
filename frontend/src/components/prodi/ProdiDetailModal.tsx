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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl space-y-6 p-5 sm:p-7 relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b border-slate-100 pb-4 pr-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {prodi.jenjang}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 uppercase">
              Jalur {jalur.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ID Prodi: {prodi.id_prodi}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
            {prodi.nama}
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-600">
            {ptnName}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Daya Tampung</span>
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-slate-900">
              {formatNumber(prodi.daya_tampung)}
            </div>
            <div className="text-[11px] text-slate-400">Kuota Saat Ini</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Peminat Terbaru</span>
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-slate-900">
              {latestHistory ? formatNumber(latestHistory.peminat) : "-"}
            </div>
            <div className="text-[11px] text-slate-400">
              Tahun {latestHistory ? latestHistory.tahun : "-"}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Diterima Terbaru</span>
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-slate-900">
              {latestHistory ? formatNumber(latestHistory.terima) : "-"}
            </div>
            <div className="text-[11px] text-slate-400">
              {latestHistory ? `${formatPercent(latestHistory.chance)} peluang` : "-"}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-purple-600" />
              <span>Peluang 5 Tahun</span>
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-slate-900">
              {formatPercent(prodi.chance_5_year)}
            </div>
            <div className="text-[11px]">
              <span className={`px-1.5 py-0.5 rounded-md font-semibold border ${getChanceBadgeColor(prodi.chance_5_year)}`}>
                {getChanceDescription(prodi.chance_5_year)}
              </span>
            </div>
          </div>
        </div>

        {/* Predictive Warning Banner (Rule: NEVER describe chance as a prediction) */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <p>
            <strong>Catatan Keketatan:</strong> Persentase peluang/keketatan dihitung murni dari data histori peminat dan kuota tahun-tahun sebelumnya. Data ini <strong>BUKAN jaminan atau prediksi kelulusan seleksi</strong>.
          </p>
        </div>

        {/* Historical Trend Chart (Recharts) */}
        {history.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>Histori Daya Tampung & Peminat ({history.map((h) => h.tahun).join(", ")})</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="tahun" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                    formatter={(val, name) => {
                      if (name === "Peluang (%)") return [`${val}%`, name];
                      return [formatNumber(Number(val)), name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="peminat"
                    name="Jumlah Peminat"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="daya_tampung"
                    name="Daya Tampung"
                    stroke="#2563eb"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="chance"
                    name="Peluang (%)"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* History Peminat Provinsi Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Statistik Asal Provinsi Peminat
              </h3>
              <p className="text-xs text-slate-500">
                Top 10 provinsi pendaftar tertinggi berdasarkan catatan histori
              </p>
            </div>

            {/* Year Filter */}
            {availableYears.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-medium">Tahun:</span>
                <button
                  onClick={() => setActiveProvYear("all")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    activeProvYear === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Semua
                </button>
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setActiveProvYear(yr)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      activeProvYear === yr
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {provStats.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-slate-200/70 rounded-xl text-center text-xs text-slate-500 space-y-1">
              <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto" />
              <p className="font-medium text-slate-700">Tidak ada catatan data statistik provinsi</p>
              <p>Sumber data tidak memiliki catatan nilai pendaftar provinsi untuk tahun ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={provStats} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="provinsi"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                      formatter={(val) => [formatNumber(Number(val)), "Jumlah Peminat"]}
                    />
                    <Bar dataKey="peminat" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                {provStats.map((item, idx) => (
                  <div
                    key={item.provinsi}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <span className="font-medium text-slate-800">
                      <strong className="text-blue-600 mr-1.5">#{idx + 1}</strong>
                      {item.provinsi}
                    </span>
                    <span className="font-bold text-slate-900">
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
