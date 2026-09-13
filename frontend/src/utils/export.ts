import * as XLSX from "xlsx";
import { PTN, Prodi } from "@/types";

export function exportPTNsToExcel(ptns: PTN[], filename = "data_ptn.xlsx") {
  const data = ptns.map((ptn) => {
    const provNames = Array.from(
      new Set(ptn.provinsi.map((p) => p.nama_prov1).filter((p) => p && p !== "none"))
    ).join(", ");
    const kotaNames = Array.from(
      new Set(ptn.provinsi.map((p) => p.nama_kota).filter((k) => k && k !== "none"))
    ).join(", ");

    return {
      "Kode PTN": ptn.kode_ptn,
      "Nama PTN": ptn.nama,
      "Tipe": ptn.type.toUpperCase(),
      "Provinsi": provNames || "-",
      "Kabupaten/Kota": kotaNames || "-",
      "Alamat": ptn.alamat !== "none" ? ptn.alamat : "-",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "PTN");
  XLSX.writeFile(workbook, filename);
}

export function exportProdiToExcel(prodiList: Prodi[], ptnName: string, jalur: string) {
  const data = prodiList.map((p) => {
    const latestHistory = p.history_daya_tampung && p.history_daya_tampung.length > 0
      ? p.history_daya_tampung[p.history_daya_tampung.length - 1]
      : null;

    return {
      "Kode/ID Prodi": p.id_prodi,
      "Nama Program Studi": p.nama,
      "Jenjang": p.jenjang,
      "Daya Tampung Saat Ini": p.daya_tampung,
      "Peminat Terbaru": latestHistory ? latestHistory.peminat : "-",
      "Diterima Terbaru": latestHistory ? latestHistory.terima : "-",
      "Keketatan/Peluang Terbaru (%)": latestHistory ? latestHistory.chance : "-",
      "Peluang 5 Tahun (%)": p.chance_5_year,
      "Portofolio": p.nama_portofolio || "Tidak Ada",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Program Studi");
  const cleanPtnName = ptnName.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 20);
  XLSX.writeFile(workbook, `prodi_${jalur}_${cleanPtnName}.xlsx`);
}

export function exportComparisonToExcel(
  ptn1: { ptn: PTN; prodi: Prodi[] },
  ptn2?: { ptn: PTN; prodi: Prodi[] }
) {
  const ptn1Name = ptn1?.ptn?.nama || "PTN 1";
  const ptn2Name = ptn2?.ptn?.nama || "PTN 2";

  const overviewData = [
    {
      "Parameter": "Nama PTN",
      [ptn1Name]: ptn1Name,
      ...(ptn2?.ptn ? { [ptn2Name]: ptn2Name } : {}),
    },
    {
      "Parameter": "Kode PTN",
      [ptn1Name]: ptn1?.ptn?.kode_ptn || "-",
      ...(ptn2?.ptn ? { [ptn2Name]: ptn2.ptn.kode_ptn } : {}),
    },
    {
      "Parameter": "Tipe",
      [ptn1Name]: ptn1?.ptn?.type ? ptn1.ptn.type.toUpperCase() : "-",
      ...(ptn2?.ptn ? { [ptn2Name]: ptn2.ptn.type.toUpperCase() } : {}),
    },
    {
      "Parameter": "Jumlah Program Studi",
      [ptn1Name]: (ptn1?.prodi || []).length,
      ...(ptn2?.ptn ? { [ptn2Name]: (ptn2.prodi || []).length } : {}),
    },
    {
      "Parameter": "Total Daya Tampung",
      [ptn1Name]: (ptn1?.prodi || []).reduce((acc, p) => acc + (p?.daya_tampung || 0), 0),
      ...(ptn2?.ptn ? { [ptn2Name]: (ptn2.prodi || []).reduce((acc, p) => acc + (p?.daya_tampung || 0), 0) } : {}),
    },
  ];

  const workbook = XLSX.utils.book_new();
  const overviewSheet = XLSX.utils.json_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(workbook, overviewSheet, "Ringkasan Perbandingan");

  if (ptn1?.prodi) {
    const ptn1ProdiSheet = XLSX.utils.json_to_sheet(
      ptn1.prodi.map((p) => ({
        "Nama Prodi": p.nama,
        "Jenjang": p.jenjang,
        "Daya Tampung": p.daya_tampung,
        "Peluang 5 Tahun (%)": p.chance_5_year,
      }))
    );
    XLSX.utils.book_append_sheet(workbook, ptn1ProdiSheet, ptn1Name.slice(0, 30));
  }

  if (ptn2?.ptn && ptn2?.prodi) {
    const ptn2ProdiSheet = XLSX.utils.json_to_sheet(
      ptn2.prodi.map((p) => ({
        "Nama Prodi": p.nama,
        "Jenjang": p.jenjang,
        "Daya Tampung": p.daya_tampung,
        "Peluang 5 Tahun (%)": p.chance_5_year,
      }))
    );
    XLSX.utils.book_append_sheet(workbook, ptn2ProdiSheet, ptn2Name.slice(0, 30));
  }

  XLSX.writeFile(workbook, "komparasi_ptn.xlsx");
}
