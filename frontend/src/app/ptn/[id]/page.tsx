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
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors border border-zinc-800 bg-zinc-950 px-3.5 py-2 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>KEMBALI KE PENCARIAN</span>
      </Link>

      {/* PTN Header Banner */}
      <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-black text-zinc-300 border border-zinc-800">
                KODE PTN: {ptn ? ptn.kode_ptn || ptn.id_ptn : ptnId}
              </span>
              {ptn && (
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full border bg-white text-black border-white">
                  {ptn.type.toUpperCase()}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {ptn ? ptn.nama : `Perguruan Tinggi Negeri #${ptnId}`}
            </h1>

            {ptn && (
              <div className="space-y-1.5 text-xs sm:text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white shrink-0" />
                  <span className="font-semibold text-zinc-300">
                    {provList.join(", ") || "Indonesia"}
                    {kotaList.length > 0 && ` (${kotaList.join(", ")})`}
                  </span>
                </div>
                {ptn.alamat && ptn.alamat !== "none" && (
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Building2 className="w-4 h-4 text-zinc-600 shrink-0" />
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
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 active:scale-95 ${
                  comparing
                    ? "bg-white text-black border-white shadow-md"
                    : "bg-black border-zinc-800 text-white hover:border-zinc-700"
                }`}
              >
                {comparing ? (
                  <>
                    <Check className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>Dalam Komparasi</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4 text-white" />
                    <span>Bandingkan PTN</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Track Switcher Bar */}
        <div className="border-t border-zinc-900 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Jalur Seleksi Aktif:
          </div>

          <div className="flex items-center gap-2 p-1 bg-black rounded-xl border border-zinc-800 self-start sm:self-auto">
            <button
              onClick={() => handleJalurChange("snbp")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all flex items-center gap-2 ${
                jalur === "snbp"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <School className="w-4 h-4" />
              <span>Jalur SNBP</span>
            </button>
            <button
              onClick={() => handleJalurChange("snbt")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all flex items-center gap-2 ${
                jalur === "snbt"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Jalur SNBT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unofficial Disclaimer Banner */}
      <DisclaimerAlert compact />

      {/* Program Study Section */}
      {isLoading ? (
        <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-12 text-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-white mx-auto" />
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            Memuat daftar program studi...
          </p>
        </div>
      ) : error ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-6 h-6 text-white mx-auto" />
          <h3 className="font-bold text-white text-base">Gagal Memuat Program Studi</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">{error}</p>
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
