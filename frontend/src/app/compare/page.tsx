"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { fetchProdiList } from "@/api/client";
import { DisclaimerAlert } from "@/components/layout/DisclaimerAlert";
import { useCompare } from "@/hooks/useCompare";
import { PTN, Prodi } from "@/types";
import { exportComparisonToExcel } from "@/utils/export";
import { capitalizeWords, formatNumber, formatPercent } from "@/utils/formatters";

interface CompareDetailData {
  ptn: PTN;
  jalur: "snbp" | "snbt";
  prodi: Prodi[];
}

export default function ComparePage() {
  const { compareList, isLoaded, removeFromCompare, clearCompare } = useCompare();
  const [ptnDetails, setPtnDetails] = useState<CompareDetailData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
            Bandingkan hingga 2 PTN secara berdampingan untuk menganalisis lokasi, kapasitas, dan prodi.
          </p>
        </div>

        {ptn1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="px-4 py-2.5 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-mono font-bold transition-colors"
            >
              Reset Komparasi
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Excel</span>
            </button>
          </div>
        )}
      </div>

      <DisclaimerAlert compact />

      {/* Empty State when no PTNs are selected */}
      {compareList.length === 0 ? (
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center mx-auto">
            <Scale className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-extrabold text-white text-lg">
              Belum Ada PTN Yang Dipilih
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Pilih maksimal 2 PTN dari halaman pencarian untuk membandingkan kapasitas dan program studinya secara berdampingan.
            </p>
          </div>
          <Link
            href="/search?jalur=snbp"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>PILIH PTN DARI EXPLORER</span>
          </Link>
        </div>
      ) : isLoading ? (
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-12 text-center space-y-3 shadow-xl">
          <RefreshCw className="w-6 h-6 animate-spin text-white mx-auto" />
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            Memuat data program studi untuk komparasi...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* PTN Selection Slot Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Slot 1 */}
            {ptn1 && ptn1.ptn ? (
              <div className="bg-zinc-950 rounded-3xl border-2 border-white p-6 space-y-4 shadow-xl relative">
                <button
                  onClick={() => removeFromCompare(ptn1.ptn.id_ptn)}
                  className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800"
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
                  <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-white" />
                    <span>
                      {Array.isArray(ptn1.ptn.provinsi)
                        ? ptn1.ptn.provinsi
                            .map((p) => capitalizeWords(p?.nama_prov1 || ""))
                            .filter((p) => p && p !== "-")
                            .join(", ") || "Indonesia"
                        : "Indonesia"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
                  <div className="bg-black p-3 rounded-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-mono">Jumlah Prodi</div>
                    <div className="font-black text-white text-base">{ptn1.prodi.length}</div>
                  </div>
                  <div className="bg-black p-3 rounded-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-mono">Total Daya Tampung</div>
                    <div className="font-black text-white text-base">
                      {formatNumber((ptn1.prodi || []).reduce((acc, p) => acc + (p?.daya_tampung || 0), 0))}
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
                  <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-white" />
                    <span>
                      {Array.isArray(ptn2.ptn.provinsi)
                        ? ptn2.ptn.provinsi
                            .map((p) => capitalizeWords(p?.nama_prov1 || ""))
                            .filter((p) => p && p !== "-")
                            .join(", ") || "Indonesia"
                        : "Indonesia"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
                  <div className="bg-black p-3 rounded-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-mono">Jumlah Prodi</div>
                    <div className="font-black text-white text-base">{ptn2.prodi.length}</div>
                  </div>
                  <div className="bg-black p-3 rounded-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-mono">Total Daya Tampung</div>
                    <div className="font-black text-white text-base">
                      {formatNumber(ptn2.prodi.reduce((acc, p) => acc + p.daya_tampung, 0))}
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
            <h3 className="font-black text-lg text-white uppercase tracking-tight">
              Matriks Perbandingan Parameter
            </h3>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-black font-mono text-zinc-400 text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">PARAMETER</th>
                    <th className="py-3.5 px-4 font-bold text-white">{ptn1?.ptn?.nama || "PTN 1"}</th>
                    {ptn2?.ptn && <th className="py-3.5 px-4 font-bold text-white">{ptn2.ptn.nama}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
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
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Total Daya Tampung</td>
                    <td className="py-3.5 px-4 font-black text-white text-base">
                      {formatNumber((ptn1?.prodi || []).reduce((acc, p) => acc + (p?.daya_tampung || 0), 0))}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3.5 px-4 font-black text-white text-base">
                        {formatNumber((ptn2.prodi || []).reduce((acc, p) => acc + (p?.daya_tampung || 0), 0))}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-zinc-400 font-mono">Jumlah Program Studi</td>
                    <td className="py-3.5 px-4 font-bold text-white">{ptn1?.prodi?.length || 0} prodi</td>
                    {ptn2?.ptn && <td className="py-3.5 px-4 font-bold text-white">{ptn2.prodi.length} prodi</td>}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Matching Program Studies Section */}
          {ptn2 && matchingProdi.length > 0 && (
            <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-white stroke-[2.2]" />
                <h3 className="font-black text-lg text-white uppercase tracking-tight">
                  Program Studi Sepadan ({matchingProdi.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingProdi.map((p1) => {
                  const p2Match = ptn2?.prodi
                    ? ptn2.prodi.find(
                        (p) => p && p.nama && p.nama.toLowerCase().trim() === p1.nama.toLowerCase().trim()
                      )
                    : undefined;
                  return (
                    <div
                      key={p1.id_prodi}
                      className="p-4 rounded-2xl bg-black border border-zinc-800 text-xs space-y-3"
                    >
                      <div className="font-extrabold text-white text-sm">{p1.nama}</div>
                      <div className="grid grid-cols-2 gap-2 text-zinc-400 pt-2 border-t border-zinc-900">
                        <div>
                          <div className="text-[10px] font-mono font-bold text-white truncate">
                            {ptn1?.ptn?.nama || "PTN 1"}
                          </div>
                          <div>Daya Tampung: {p1.daya_tampung}</div>
                          <div>Peluang: {formatPercent(p1.chance_5_year)}</div>
                        </div>
                        {p2Match && (
                          <div>
                            <div className="text-[10px] font-mono font-bold text-white truncate">
                              {ptn2?.ptn?.nama || "PTN 2"}
                            </div>
                            <div>Daya Tampung: {p2Match.daya_tampung}</div>
                            <div>Peluang: {formatPercent(p2Match.chance_5_year)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
