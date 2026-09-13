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
  School,
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
      <div className="p-12 text-center text-slate-500 font-medium">
        Memuat data komparasi...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-blue-600" />
            <span>Komparasi Perguruan Tinggi Negeri</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bandingkan hingga 2 PTN secara berdampingan untuk melihat perbedaan lokasi, daya tampung, dan program studi.
          </p>
        </div>

        {ptn1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="px-3 py-2 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold"
            >
              Reset Komparasi
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
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
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Scale className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-bold text-slate-900 text-lg">
              Belum Ada PTN Yang Dipilih
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilih maksimal 2 PTN dari halaman pencarian untuk membandingkan kapasitas dan program studinya.
            </p>
          </div>
          <Link
            href="/search?jalur=snbp"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Pilih PTN Dari Explorer</span>
          </Link>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Memuat data program studi untuk komparasi...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* PTN Selection Slot Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slot 1 */}
            {ptn1 && ptn1.ptn ? (
              <div className="bg-white rounded-3xl border-2 border-blue-500 p-6 space-y-4 shadow-md relative">
                <button
                  onClick={() => removeFromCompare(ptn1.ptn.id_ptn)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-2 pr-8">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 uppercase">
                    PTN Pertama ({ptn1.jalur.toUpperCase()})
                  </span>
                  <h3 className="font-extrabold text-xl text-slate-900">
                    {ptn1.ptn.nama}
                  </h3>
                  <div className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
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
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">Jumlah Prodi</div>
                    <div className="font-bold text-slate-900 text-base">{ptn1.prodi.length}</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">Total Daya Tampung</div>
                    <div className="font-bold text-blue-600 text-base">
                      {formatNumber((ptn1.prodi || []).reduce((acc, p) => acc + (p?.daya_tampung || 0), 0))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Slot 2 */}
            {ptn2 && ptn2.ptn ? (
              <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 space-y-4 shadow-md relative">
                <button
                  onClick={() => removeFromCompare(ptn2.ptn.id_ptn)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-2 pr-8">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                    PTN Kedua ({ptn2.jalur.toUpperCase()})
                  </span>
                  <h3 className="font-extrabold text-xl text-slate-900">
                    {ptn2.ptn.nama}
                  </h3>
                  <div className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
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
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">Jumlah Prodi</div>
                    <div className="font-bold text-slate-900 text-base">{ptn2.prodi.length}</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">Total Daya Tampung</div>
                    <div className="font-bold text-emerald-600 text-base">
                      {formatNumber(ptn2.prodi.reduce((acc, p) => acc + p.daya_tampung, 0))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
                <div className="w-10 h-10 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Pilih PTN Kedua</h4>
                  <p className="text-xs text-slate-500">
                    Tambah PTN lain untuk membandingkan secara lengkap
                  </p>
                </div>
                <Link
                  href="/search?jalur=snbp"
                  className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Cari PTN
                </Link>
              </div>
            )}
          </div>

          {/* Comparison Matrix Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">
              Matriks Perbandingan Parameter
            </h3>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-3 px-4">Parameter</th>
                    <th className="py-3 px-4 text-blue-700">{ptn1?.ptn?.nama || "PTN 1"}</th>
                    {ptn2?.ptn && <th className="py-3 px-4 text-emerald-700">{ptn2.ptn.nama}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700">Kode PTN</td>
                    <td className="py-3 px-4 font-mono">{ptn1?.ptn?.kode_ptn || "-"}</td>
                    {ptn2?.ptn && <td className="py-3 px-4 font-mono">{ptn2.ptn.kode_ptn}</td>}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700">Tipe PTN</td>
                    <td className="py-3 px-4 uppercase font-medium">{ptn1?.ptn?.type || "-"}</td>
                    {ptn2?.ptn && <td className="py-3 px-4 uppercase font-medium">{ptn2.ptn.type}</td>}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700">Provinsi</td>
                    <td className="py-3 px-4">
                      {Array.isArray(ptn1?.ptn?.provinsi)
                        ? ptn1.ptn.provinsi.map((p) => capitalizeWords(p?.nama_prov1 || "")).filter(Boolean).join(", ") || "-"
                        : "-"}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3 px-4">
                        {Array.isArray(ptn2.ptn.provinsi)
                          ? ptn2.ptn.provinsi.map((p) => capitalizeWords(p?.nama_prov1 || "")).filter(Boolean).join(", ") || "-"
                          : "-"}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 font-bold">Total Daya Tampung</td>
                    <td className="py-3 px-4 font-bold text-blue-600">
                      {formatNumber((ptn1?.prodi || []).reduce((acc, p) => acc + (p?.daya_tampung || 0), 0))}
                    </td>
                    {ptn2?.ptn && (
                      <td className="py-3 px-4 font-bold text-emerald-600">
                        {formatNumber((ptn2.prodi || []).reduce((acc, p) => acc + (p?.daya_tampung || 0), 0))}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700">Jumlah Program Studi</td>
                    <td className="py-3 px-4 font-bold">{ptn1?.prodi?.length || 0} prodi</td>
                    {ptn2?.ptn && <td className="py-3 px-4 font-bold">{ptn2.prodi.length} prodi</td>}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Matching Program Studies Section */}
          {ptn2 && matchingProdi.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-lg text-slate-900">
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
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                    >
                      <div className="font-bold text-slate-900 text-sm">{p1.nama}</div>
                      <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1 border-t border-slate-200/60">
                        <div>
                          <div className="text-[10px] text-blue-600 font-semibold truncate">
                            {ptn1?.ptn?.nama || "PTN 1"}
                          </div>
                          <div>Daya Tampung: {p1.daya_tampung}</div>
                          <div>Peluang: {formatPercent(p1.chance_5_year)}</div>
                        </div>
                        {p2Match && (
                          <div>
                            <div className="text-[10px] text-emerald-600 font-semibold truncate">
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
