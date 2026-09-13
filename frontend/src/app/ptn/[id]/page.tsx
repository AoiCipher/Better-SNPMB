"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  MapPin,
  Scale,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Check,
  School,
  BookOpen,
} from "lucide-react";
import { fetchProdiList, fetchPTNs } from "@/api/client";
import { ProdiList } from "@/components/ptn/ProdiList";
import { ProdiDetailModal } from "@/components/prodi/ProdiDetailModal";
import { DisclaimerAlert } from "@/components/layout/DisclaimerAlert";
import { useCompare } from "@/hooks/useCompare";
import { Jalur, PTN, Prodi } from "@/types";
import { capitalizeWords } from "@/utils/formatters";

export default function PTNDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const ptnId = resolvedParams.id;

  const router = useRouter();
  const searchParams = useSearchParams();
  const jalur: Jalur = (searchParams.get("jalur") as Jalur) || "snbp";

  const { isComparing, toggleCompare } = useCompare();

  const [ptn, setPtn] = useState<PTN | null>(null);
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProdi, setSelectedProdi] = useState<Prodi | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    // Fetch both PTN metadata and Prodi list concurrently
    Promise.all([
      fetchPTNs(jalur).catch(() => []),
      fetchProdiList(jalur, ptnId),
    ])
      .then(([ptnList, prodiData]) => {
        if (!isMounted) return;

        const foundPtn = ptnList.find(
          (p) => String(p.id_ptn) === ptnId || String(p.kode_ptn) === ptnId
        );

        if (foundPtn) {
          setPtn(foundPtn);
        } else if (prodiData.length > 0) {
          // Construct fallback PTN object from params if metadata endpoint was partial
          setPtn({
            id_ptn: Number(ptnId),
            kode_ptn: Number(ptnId),
            nama: `PTN #${ptnId}`,
            type: "akademik",
            alamat: "none",
            provinsi: [],
          });
        }

        setProdiList(prodiData);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Gagal memuat data program studi PTN.");
        setProdiList([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [ptnId, jalur]);

  const handleJalurChange = (newJalur: Jalur) => {
    router.push(`/ptn/${ptnId}?jalur=${newJalur}`);
  };

  const provList = ptn
    ? Array.from(
        new Set(
          ptn.provinsi
            .map((p) => capitalizeWords(p.nama_prov1))
            .filter((p) => p !== "-")
        )
      )
    : [];

  const kotaList = ptn
    ? Array.from(
        new Set(
          ptn.provinsi
            .map((p) => capitalizeWords(p.nama_kota))
            .filter((k) => k !== "-")
        )
      )
    : [];

  const comparing = ptn ? isComparing(ptn.id_ptn) : false;

  return (
    <div className="space-y-6 pb-16">
      {/* Back Button */}
      <Link
        href={`/search?jalur=${jalur}`}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Pencarian</span>
      </Link>

      {/* PTN Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                Kode PTN: {ptn ? ptn.kode_ptn || ptn.id_ptn : ptnId}
              </span>
              {ptn && (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    ptn.type.toLowerCase() === "vokasi"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {ptn.type.toUpperCase()}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {ptn ? ptn.nama : `Perguruan Tinggi Negeri #${ptnId}`}
            </h1>

            {ptn && (
              <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700">
                    {provList.join(", ") || "Indonesia"}
                    {kotaList.length > 0 && ` (${kotaList.join(", ")})`}
                  </span>
                </div>
                {ptn.alamat && ptn.alamat !== "none" && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{ptn.alamat}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            {ptn && (
              <button
                type="button"
                onClick={() => toggleCompare(ptn, jalur)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-2 ${
                  comparing
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {comparing ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Dalam Komparasi</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4 text-slate-500" />
                    <span>Bandingkan PTN</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Track Switcher Bar */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-semibold text-slate-500">
            Jalur Seleksi Aktif:
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-100/90 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => handleJalurChange("snbp")}
              className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                jalur === "snbp"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Jalur SNBP</span>
            </button>
            <button
              onClick={() => handleJalurChange("snbt")}
              className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                jalur === "snbt"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Jalur SNBT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unofficial Disclaimer Banner */}
      <DisclaimerAlert compact />

      {/* Program Study Section */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Memuat daftar program studi...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
          <h3 className="font-bold text-red-900 text-base">Gagal Memuat Program Studi</h3>
          <p className="text-xs text-red-700 max-w-md mx-auto">{error}</p>
        </div>
      ) : (
        <ProdiList
          prodiList={prodiList}
          ptnName={ptn ? ptn.nama : `PTN #${ptnId}`}
          jalur={jalur}
          onSelectProdi={(p) => setSelectedProdi(p)}
        />
      )}

      {/* Program Detail Modal */}
      {selectedProdi && (
        <ProdiDetailModal
          prodi={selectedProdi}
          ptnName={ptn ? ptn.nama : `PTN #${ptnId}`}
          jalur={jalur}
          onClose={() => setSelectedProdi(null)}
        />
      )}
    </div>
  );
}
