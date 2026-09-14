"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Scale,
  X,
  Plus,
  Download,
  Building2,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Eye,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  Search,
} from "lucide-react";
import { fetchProdiList } from "@/api/client";
import { DisclaimerAlert } from "@/components/layout/DisclaimerAlert";
import { ProdiDetailModal } from "@/components/prodi/ProdiDetailModal";
import { useCompare } from "@/hooks/useCompare";
import { PTN, Prodi } from "@/types";
import { exportComparisonToExcel } from "@/utils/export";
import { capitalizeWords, formatNumber, formatPercent } from "@/utils/formatters";

interface CompareDetailData {
  ptn: PTN;
  jalur: "snbp" | "snbt";
  prodi: Prodi[];
}

function getPTNMetrics(detail: CompareDetailData | null) {
  if (!detail || !detail.prodi || detail.prodi.length === 0) {
    return {
      totalDayaTampung: 0,
      totalProdi: 0,
      avgDayaTampung: 0,
      avgChance: 0,
      totalPeminatLatest: 0,
      competitionRatio: "-",
      jenjangSummary: "-",
      mostCompetitive: null as Prodi | null,
      largestQuota: null as Prodi | null,
    };
  }

  const prodi = detail.prodi;
  const totalProdi = prodi.length;
  const totalDayaTampung = prodi.reduce((acc, p) => acc + (p?.daya_tampung || 0), 0);
  const avgDayaTampung = Math.round(totalDayaTampung / totalProdi);
  const avgChance = prodi.reduce((acc, p) => acc + (p?.chance_5_year || 0), 0) / totalProdi;

  let totalPeminatLatest = 0;
  prodi.forEach((p) => {
    const history = p.history_daya_tampung;
    if (history && history.length > 0) {
      totalPeminatLatest += history[history.length - 1]?.peminat || 0;
    }
  });

  const competitionRatio =
    totalDayaTampung > 0 && totalPeminatLatest > 0
      ? `${(totalPeminatLatest / totalDayaTampung).toFixed(1)}x (${formatNumber(
          totalPeminatLatest
        )} peminat)`
      : "-";

  const jenjangCounts: Record<string, number> = {};
  prodi.forEach((p) => {
    if (p.jenjang) {
      jenjangCounts[p.jenjang] = (jenjangCounts[p.jenjang] || 0) + 1;
    }
  });
  const jenjangSummary = Object.entries(jenjangCounts)
    .map(([j, cnt]) => `${j}: ${cnt}`)
    .join(", ");

  const sortedByChance = [...prodi].sort(
    (a, b) => (a.chance_5_year || 0) - (b.chance_5_year || 0)
  );
  const mostCompetitive = sortedByChance[0] || null;

  const sortedByQuota = [...prodi].sort(
    (a, b) => (b.daya_tampung || 0) - (a.daya_tampung || 0)
  );
  const largestQuota = sortedByQuota[0] || null;

  return {
    totalDayaTampung,
    totalProdi,
    avgDayaTampung,
    avgChance,
    totalPeminatLatest,
    competitionRatio,
    jenjangSummary: jenjangSummary || "-",
    mostCompetitive,
    largestQuota,
  };
}

export default function ComparePage() {
  const { compareList, isLoaded, removeFromCompare, clearCompare } = useCompare();
  const [ptnDetails, setPtnDetails] = useState<CompareDetailData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProdiInfo, setSelectedProdiInfo] = useState<{
    prodi: Prodi;
    ptnName: string;
    jalur: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"matching" | "all_ptn1" | "all_ptn2">("matching");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isLoaded || compareList.length === 0) {
      setPtnDetails([]);
      return;
    }

    const validList = compareList.filter((item) => item && item.ptn);
    if (validList.length === 0) {
      setPtnDetails([]);
      return;
    }

    setIsLoading(true);
    Promise.all(
      validList.map((item) =>
        fetchProdiList(item.jalur, item.ptn.id_ptn)
          .then((prodiData) => ({
            ptn: item.ptn,
            jalur: item.jalur,
            prodi: prodiData,
          }))
          .catch(() => ({
            ptn: item.ptn,
            jalur: item.jalur,
            prodi: [],
          }))
      )
    )
      .then((res) => {
        setPtnDetails(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [compareList, isLoaded]);

  const ptn1 = ptnDetails[0]?.ptn?.id_ptn !== undefined ? ptnDetails[0] : null;
  const ptn2 = ptnDetails[1]?.ptn?.id_ptn !== undefined ? ptnDetails[1] : null;

  const metrics1 = getPTNMetrics(ptn1);
  const metrics2 = getPTNMetrics(ptn2);

  // Find matching programs between PTN 1 & PTN 2
  const matchingProdi =
    ptn1 && ptn2 && Array.isArray(ptn1.prodi) && Array.isArray(ptn2.prodi)
      ? ptn1.prodi.filter((p1) =>
          p1 && p1.nama && ptn2.prodi.some(
            (p2) =>
              p2 && p2.nama &&
              (p2.nama.toLowerCase().trim() === p1.nama.toLowerCase().trim() ||
              p2.nama.toLowerCase().includes(p1.nama.toLowerCase().split(" ")[0]))
          )
        )
      : [];

  const filteredMatchingProdi = matchingProdi.filter((p) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    return p.nama.toLowerCase().includes(query) || (p.jenjang && p.jenjang.toLowerCase().includes(query));
  });

  const filteredPtn1Prodi = (ptn1?.prodi || []).filter((p) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    return p.nama.toLowerCase().includes(query) || (p.jenjang && p.jenjang.toLowerCase().includes(query));
  });

  const filteredPtn2Prodi = (ptn2?.prodi || []).filter((p) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    return p.nama.toLowerCase().includes(query) || (p.jenjang && p.jenjang.toLowerCase().includes(query));
  });

  const handleExportExcel = () => {
    if (!ptn1 || !ptn1.ptn) return;
    exportComparisonToExcel(
      { ptn: ptn1.ptn, prodi: ptn1.prodi || [] },
      ptn2 && ptn2.ptn ? { ptn: ptn2.ptn, prodi: ptn2.prodi || [] } : undefined
    );
  };

  if (!isLoaded) {
    return (
      <div className="p-12 text-center text-zinc-400 font-mono text-sm">
        Memuat data komparasi...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
            HEAD-TO-HEAD ANALYTICS
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Scale className="w-8 h-8 text-white stroke-[2.5]" />
            <span>Komparasi Perguruan Tinggi Negeri</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Bandingkan parameter daya tampung, ketetatan peluang, serta program studi antar PTN secara komprehensif.
          </p>
        </div>

        {compareList.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-white text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={clearCompare}
              className="px-4 py-2.5 bg-red-950/40 border border-red-800/60 hover:bg-red-900/40 text-red-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Bersihkan</span>
            </button>
          </div>
        )}
      </div>

      <DisclaimerAlert />

      {compareList.length === 0 ? (
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-white">Belum Ada PTN Dipilih</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
              Pilih hingga 2 PTN dari halaman pencarian untuk melihat matriks perbandingan parameter dan program studi secara mendalam.
            </p>
          </div>
          <Link
            href="/search?jalur=snbp"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-zinc-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Pilih PTN Sekarang</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top PTN Cards Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slot 1 */}
            {ptn1 && ptn1.ptn ? (
              <div className="bg-zinc-950 rounded-3xl border-2 border-white p-6 space-y-4 shadow-xl relative">
                <button
                  onClick={() => removeFromCompare(ptn1.ptn.id_ptn)}
                  className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800"
                  title="Hapus dari komparasi"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-2 pr-8">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-white text-black uppercase">
                    PTN 1 ({ptn1.jalur.toUpperCase()})
                  </span>
                  <h3 className="font-black text-xl text-white">
                    {ptn1.ptn.nama}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> Kode {ptn1.ptn.kode_ptn}
                    </span>
                    <span>•</span>
                    <span className="uppercase">{ptn1.ptn.type}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
                  <div className="bg-black p-3 rounded-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-mono">Jumlah Prodi</div>
                    <div className="font-black text-white text-base">{metrics1.totalProdi}</div>
                  </div>
                  <div className="bg-black p-3 rounded-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-mono">Total Daya Tampung</div>
                    <div className="font-black text-white text-base">
                      {formatNumber(metrics1.totalDayaTampung)}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Slot 2 */}
            {ptn2 && ptn2.ptn ? (
              <div className="bg-zinc-950 rounded-3xl border-2 border-white p-6 space-y-4 shadow-xl relative">
                <button
                  onClick={() => removeFromCompare(ptn2.ptn.id_ptn)}
                  className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800"
                  title="Hapus dari komparasi"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-2 pr-8">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-white text-black uppercase">
                    PTN 2 ({ptn2.jalur.toUpperCase()})
                  </span>
                  <h3 className="font-black text-xl text-white">
                    {ptn2.ptn.nama}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> Kode {ptn2.ptn.kode_ptn}
                    </span>
                    <span>•</span>
                    <span className="uppercase">{ptn2.ptn.type}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
                  <div className="bg-black p-3 rounded-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-mono">Jumlah Prodi</div>
                    <div className="font-black text-white text-base">{metrics2.totalProdi}</div>
                  </div>
                  <div className="bg-black p-3 rounded-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-mono">Total Daya Tampung</div>
                    <div className="font-black text-white text-base">
                      {formatNumber(metrics2.totalDayaTampung)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-black border-2 border-dashed border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Pilih PTN Kedua</h4>
                  <p className="text-xs text-zinc-400 max-w-xs">
                    Tambah PTN lain dari explorer untuk membandingkan parameter secara lengkap
                  </p>
                </div>
                <Link
                  href="/search?jalur=snbp"
                  className="px-5 py-2.5 bg-white text-black rounded-xl text-xs font-bold hover:bg-zinc-200 transition-colors"
                >
                  Cari PTN
                </Link>
              </div>
            )}
          </div>

          {/* Comparison Matrix Table */}
          <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-white uppercase tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Matriks Perbandingan Parameter</span>
              </h3>
              {isLoading && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Memuat data prodi...</span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-black font-mono text-zinc-400 text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold min-w-[200px]">PARAMETER</th>
                    <th className="py-3.5 px-4 font-bold text-white min-w-[220px]">
                      {ptn1?.ptn?.nama || "PTN 1"}
                    </th>
                    {ptn2?.ptn && (
                      <th className="py-3.5 px-4 font-bold text-white min-w-[220px]">
                        {ptn2.ptn.nama}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {/* Basic Identifiers */}
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Kode PTN</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{ptn1?.ptn?.kode_ptn || "-"}</td>
                    {ptn2?.ptn && <td className="py-3.5 px-4 font-mono font-bold text-white">{ptn2.ptn.kode_ptn}</td>}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Tipe PTN</td>
                    <td className="py-3.5 px-4 uppercase font-bold text-white">{ptn1?.ptn?.type || "-"}</td>
                    {ptn2?.ptn && <td className="py-3.5 px-4 uppercase font-bold text-white">{ptn2.ptn.type}</td>}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Provinsi</td>
                    <td className="py-3.5 px-4 text-zinc-300 font-semibold">
                      {Array.isArray(ptn1?.ptn?.provinsi)
                        ? ptn1.ptn.provinsi.map((p) => capitalizeWords(p?.nama_prov1 || "")).filter(Boolean).join(", ") || "-"
                        : "-"}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3.5 px-4 text-zinc-300 font-semibold">
                        {Array.isArray(ptn2.ptn.provinsi)
                          ? ptn2.ptn.provinsi.map((p) => capitalizeWords(p?.nama_prov1 || "")).filter(Boolean).join(", ") || "-"
                          : "-"}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Alamat</td>
                    <td className="py-3.5 px-4 text-zinc-300 text-xs">
                      {ptn1?.ptn?.alamat && ptn1.ptn.alamat !== "none" ? ptn1.ptn.alamat : "-"}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3.5 px-4 text-zinc-300 text-xs">
                        {ptn2.ptn.alamat && ptn2.ptn.alamat !== "none" ? ptn2.ptn.alamat : "-"}
                      </td>
                    )}
                  </tr>

                  {/* Quantitative Capacity & Prodi Metrics */}
                  <tr className="bg-zinc-900/30">
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Jumlah Program Studi</td>
                    <td className="py-3.5 px-4 font-bold text-white">{metrics1.totalProdi} prodi</td>
                    {ptn2?.ptn && <td className="py-3.5 px-4 font-bold text-white">{metrics2.totalProdi} prodi</td>}
                  </tr>
                  <tr className="bg-zinc-900/30">
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Total Daya Tampung</td>
                    <td className="py-3.5 px-4 font-black text-white text-base">
                      {formatNumber(metrics1.totalDayaTampung)}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3.5 px-4 font-black text-white text-base">
                        {formatNumber(metrics2.totalDayaTampung)}
                      </td>
                    )}
                  </tr>
                  <tr className="bg-zinc-900/30">
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Rata-rata Kuota / Prodi</td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {metrics1.avgDayaTampung ? `${metrics1.avgDayaTampung} kursi` : "-"}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {metrics2.avgDayaTampung ? `${metrics2.avgDayaTampung} kursi` : "-"}
                      </td>
                    )}
                  </tr>

                  {/* Competitiveness & Applicant Metrics */}
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Rata-rata Peluang (5 Thn)</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      {formatPercent(metrics1.avgChance)}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        {formatPercent(metrics2.avgChance)}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Rasio Persaingan (Terbaru)</td>
                    <td className="py-3.5 px-4 text-zinc-300 font-mono text-xs">
                      {metrics1.competitionRatio}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3.5 px-4 text-zinc-300 font-mono text-xs">
                        {metrics2.competitionRatio}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Sebaran Jenjang</td>
                    <td className="py-3.5 px-4 text-zinc-300 font-mono text-xs">
                      {metrics1.jenjangSummary}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3.5 px-4 text-zinc-300 font-mono text-xs">
                        {metrics2.jenjangSummary}
                      </td>
                    )}
                  </tr>

                  {/* Top Highlights */}
                  <tr className="bg-zinc-900/30">
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Prodi Paling Ketat</td>
                    <td className="py-3.5 px-4">
                      {metrics1.mostCompetitive ? (
                        <button
                          onClick={() =>
                            setSelectedProdiInfo({
                              prodi: metrics1.mostCompetitive!,
                              ptnName: ptn1!.ptn.nama,
                              jalur: ptn1!.jalur,
                            })
                          }
                          className="text-left group hover:text-white"
                        >
                          <div className="font-bold text-white group-hover:underline flex items-center gap-1">
                            <span>{metrics1.mostCompetitive.nama}</span>
                            <Eye className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            Peluang: {formatPercent(metrics1.mostCompetitive.chance_5_year)} • Kuota: {metrics1.mostCompetitive.daya_tampung}
                          </div>
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3.5 px-4">
                        {metrics2.mostCompetitive ? (
                          <button
                            onClick={() =>
                              setSelectedProdiInfo({
                                prodi: metrics2.mostCompetitive!,
                                ptnName: ptn2.ptn.nama,
                                jalur: ptn2.jalur,
                              })
                            }
                            className="text-left group hover:text-white"
                          >
                            <div className="font-bold text-white group-hover:underline flex items-center gap-1">
                              <span>{metrics2.mostCompetitive.nama}</span>
                              <Eye className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                            </div>
                            <div className="text-[11px] text-zinc-400 font-mono">
                              Peluang: {formatPercent(metrics2.mostCompetitive.chance_5_year)} • Kuota: {metrics2.mostCompetitive.daya_tampung}
                            </div>
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    )}
                  </tr>

                  <tr className="bg-zinc-900/30">
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Daya Tampung Terbesar</td>
                    <td className="py-3.5 px-4">
                      {metrics1.largestQuota ? (
                        <button
                          onClick={() =>
                            setSelectedProdiInfo({
                              prodi: metrics1.largestQuota!,
                              ptnName: ptn1!.ptn.nama,
                              jalur: ptn1!.jalur,
                            })
                          }
                          className="text-left group hover:text-white"
                        >
                          <div className="font-bold text-white group-hover:underline flex items-center gap-1">
                            <span>{metrics1.largestQuota.nama}</span>
                            <Eye className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            Kuota: {metrics1.largestQuota.daya_tampung} kursi
                          </div>
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3.5 px-4">
                        {metrics2.largestQuota ? (
                          <button
                            onClick={() =>
                              setSelectedProdiInfo({
                                prodi: metrics2.largestQuota!,
                                ptnName: ptn2.ptn.nama,
                                jalur: ptn2.jalur,
                              })
                            }
                            className="text-left group hover:text-white"
                          >
                            <div className="font-bold text-white group-hover:underline flex items-center gap-1">
                              <span>{metrics2.largestQuota.nama}</span>
                              <Eye className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                            </div>
                            <div className="text-[11px] text-zinc-400 font-mono">
                              Kuota: {metrics2.largestQuota.daya_tampung} kursi
                            </div>
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Program Studi Section with Tabs & Clickable Cards */}
          <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-6 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
              <div>
                <h3 className="font-black text-lg text-white uppercase tracking-tight flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Daftar Program Studi</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Klik pada program studi mana pun untuk melihat grafik histori & analisis detail.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Search Input */}
                <div className="relative min-w-[200px] sm:w-64">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari prodi / jenjang..."
                    className="w-full pl-9 pr-8 py-1.5 bg-black border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                      title="Hapus pencarian"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-1.5 bg-black p-1 rounded-xl border border-zinc-800 text-xs font-semibold shrink-0">
                  {ptn2 && matchingProdi.length > 0 && (
                    <button
                      onClick={() => setActiveTab("matching")}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        activeTab === "matching"
                          ? "bg-white text-black font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Sepadan ({matchingProdi.length})
                    </button>
                  )}
                  {ptn1 && (
                    <button
                      onClick={() => setActiveTab("all_ptn1")}
                      className={`px-3 py-1.5 rounded-lg transition-colors truncate max-w-[140px] ${
                        activeTab === "all_ptn1"
                          ? "bg-white text-black font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {ptn1.ptn.nama} ({ptn1.prodi.length})
                    </button>
                  )}
                  {ptn2 && (
                    <button
                      onClick={() => setActiveTab("all_ptn2")}
                      className={`px-3 py-1.5 rounded-lg transition-colors truncate max-w-[140px] ${
                        activeTab === "all_ptn2"
                          ? "bg-white text-black font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {ptn2.ptn.nama} ({ptn2.prodi.length})
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* TAB: Program Studi Sepadan (Side-by-side matching) */}
            {(activeTab === "matching" || !ptn2) && ptn2 && matchingProdi.length > 0 && (
              filteredMatchingProdi.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredMatchingProdi.map((p1) => {
                    const p2Match = ptn2?.prodi
                      ? ptn2.prodi.find(
                          (p) => p && p.nama && p.nama.toLowerCase().trim() === p1.nama.toLowerCase().trim()
                        )
                      : undefined;
                    return (
                      <div
                        key={p1.id_prodi}
                        className="p-4 rounded-2xl bg-black border border-zinc-800 text-xs space-y-3 hover:border-zinc-700 transition-all"
                      >
                        <div className="font-extrabold text-white text-sm flex items-center justify-between">
                          <span>{p1.nama}</span>
                          <span className="text-[10px] font-mono font-normal text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                            {p1.jenjang}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-zinc-400 pt-2 border-t border-zinc-900">
                          {/* PTN 1 Column */}
                          <div
                            onClick={() =>
                              setSelectedProdiInfo({
                                prodi: p1,
                                ptnName: ptn1!.ptn.nama,
                                jalur: ptn1!.jalur,
                              })
                            }
                            className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-white cursor-pointer group transition-all"
                          >
                            <div className="text-[10px] font-mono font-bold text-white truncate flex items-center justify-between">
                              <span className="truncate">{ptn1?.ptn?.nama || "PTN 1"}</span>
                              <Eye className="w-3 h-3 text-zinc-500 group-hover:text-white shrink-0 ml-1" />
                            </div>
                            <div className="mt-1 space-y-0.5 text-[11px]">
                              <div>Daya Tampung: <span className="font-bold text-white">{p1.daya_tampung}</span></div>
                              <div>Peluang: <span className="font-bold text-emerald-400">{formatPercent(p1.chance_5_year)}</span></div>
                            </div>
                          </div>

                          {/* PTN 2 Column */}
                          {p2Match && (
                            <div
                              onClick={() =>
                                setSelectedProdiInfo({
                                  prodi: p2Match,
                                  ptnName: ptn2!.ptn.nama,
                                  jalur: ptn2!.jalur,
                                })
                              }
                              className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-white cursor-pointer group transition-all"
                            >
                              <div className="text-[10px] font-mono font-bold text-white truncate flex items-center justify-between">
                                <span className="truncate">{ptn2?.ptn?.nama || "PTN 2"}</span>
                                <Eye className="w-3 h-3 text-zinc-500 group-hover:text-white shrink-0 ml-1" />
                              </div>
                              <div className="mt-1 space-y-0.5 text-[11px]">
                                <div>Daya Tampung: <span className="font-bold text-white">{p2Match.daya_tampung}</span></div>
                                <div>Peluang: <span className="font-bold text-emerald-400">{formatPercent(p2Match.chance_5_year)}</span></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-black rounded-2xl border border-zinc-800 space-y-1">
                  <p className="text-xs font-semibold text-zinc-300">Tidak ada program studi sepadan yang cocok</p>
                  {searchTerm && (
                    <p className="text-[11px] text-zinc-500 font-mono">
                      Kata kunci: &quot;{searchTerm}&quot;
                    </p>
                  )}
                </div>
              )
            )}

            {/* TAB: PTN 1 All Prodi */}
            {(activeTab === "all_ptn1" || (!matchingProdi.length && ptn1)) && ptn1 && (
              filteredPtn1Prodi.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPtn1Prodi.map((p) => (
                    <button
                      key={p.id_prodi}
                      onClick={() =>
                        setSelectedProdiInfo({
                          prodi: p,
                          ptnName: ptn1.ptn.nama,
                          jalur: ptn1.jalur,
                        })
                      }
                      className="p-3.5 rounded-2xl bg-black border border-zinc-800 hover:border-white text-left transition-all group space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-xs group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {p.nama}
                        </h4>
                        <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800 shrink-0">
                          {p.jenjang}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>Kuota: <strong className="text-white">{p.daya_tampung}</strong></span>
                        <span>Peluang: <strong className="text-emerald-400">{formatPercent(p.chance_5_year)}</strong></span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-black rounded-2xl border border-zinc-800 space-y-1">
                  <p className="text-xs font-semibold text-zinc-300">Tidak ada program studi yang cocok</p>
                  {searchTerm && (
                    <p className="text-[11px] text-zinc-500 font-mono">
                      Kata kunci: &quot;{searchTerm}&quot;
                    </p>
                  )}
                </div>
              )
            )}

            {/* TAB: PTN 2 All Prodi */}
            {activeTab === "all_ptn2" && ptn2 && (
              filteredPtn2Prodi.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPtn2Prodi.map((p) => (
                    <button
                      key={p.id_prodi}
                      onClick={() =>
                        setSelectedProdiInfo({
                          prodi: p,
                          ptnName: ptn2.ptn.nama,
                          jalur: ptn2.jalur,
                        })
                      }
                      className="p-3.5 rounded-2xl bg-black border border-zinc-800 hover:border-white text-left transition-all group space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-xs group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {p.nama}
                        </h4>
                        <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800 shrink-0">
                          {p.jenjang}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>Kuota: <strong className="text-white">{p.daya_tampung}</strong></span>
                        <span>Peluang: <strong className="text-emerald-400">{formatPercent(p.chance_5_year)}</strong></span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-black rounded-2xl border border-zinc-800 space-y-1">
                  <p className="text-xs font-semibold text-zinc-300">Tidak ada program studi yang cocok</p>
                  {searchTerm && (
                    <p className="text-[11px] text-zinc-500 font-mono">
                      Kata kunci: &quot;{searchTerm}&quot;
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Prodi Detail Modal Popup when clicked */}
      {selectedProdiInfo && (
        <ProdiDetailModal
          prodi={selectedProdiInfo.prodi}
          ptnName={selectedProdiInfo.ptnName}
          jalur={selectedProdiInfo.jalur}
          onClose={() => setSelectedProdiInfo(null)}
        />
      )}
    </div>
  );
}
