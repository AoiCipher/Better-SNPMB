export type Jalur = "snbp" | "snbt";

export interface PTNProvinsi {
  kode_prov1: string;
  nama_prov1: string;
  kode_kota: string;
  nama_kota: string;
}

export interface PTN {
  id_ptn: number;
  kode_ptn: number;
  nama: string;
  type: "akademik" | "vokasi" | "ptkin" | string;
  alamat: string;
  provinsi: PTNProvinsi[];
}

export interface HistoryDayaTampung {
  tahun: number;
  daya_tampung: number;
  peminat: number;
  terima: number;
  chance: number;
}

export interface HistoryPeminatProvinsi {
  [provinsiName: string]: {
    [tahun: string]: number;
  };
}

export interface Prodi {
  id_prodi: number;
  nama: string;
  jenjang: string;
  daya_tampung: number;
  kode_portofolio?: number | null;
  nama_portofolio?: string | null;
  history_daya_tampung: HistoryDayaTampung[];
  chance_5_year: number;
  history_peminat_provinsi?: HistoryPeminatProvinsi;
}

export interface FilterParams {
  jalur: Jalur;
  provinsi?: string;
  kota?: string;
  ptn?: string;
}

export interface HealthResponse {
  status: string;
}
