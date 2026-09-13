import { HealthResponse, Jalur, PTN, Prodi } from "@/types";

const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!envUrl) return "http://localhost:8000";
  // Ensure http/https scheme if user provided host without protocol
  if (!envUrl.startsWith("http://") && !envUrl.startsWith("https://")) {
    return `http://${envUrl}`;
  }
  return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
};

export async function fetchHealth(): Promise<HealthResponse> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/health`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.statusText}`);
  }
  return res.json();
}

export interface FetchPTNsOptions {
  provinsi?: string;
  kota?: string;
}

export async function fetchPTNs(jalur: Jalur, options?: FetchPTNsOptions): Promise<PTN[]> {
  const baseUrl = getBaseUrl();
  const params = new URLSearchParams();

  if (options?.provinsi?.trim()) {
    params.set("provinsi", options.provinsi.trim());
  }
  if (options?.kota?.trim()) {
    params.set("kota", options.kota.trim());
  }

  const queryString = params.toString();
  const url = `${baseUrl}/${jalur}${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data PTN (${jalur.toUpperCase()}): ${res.statusText}`);
  }
  return res.json();
}

export async function fetchProdiList(jalur: Jalur, ptnIdentifier: string | number): Promise<Prodi[]> {
  const baseUrl = getBaseUrl();
  const params = new URLSearchParams({ ptn: String(ptnIdentifier).trim() });
  const url = `${baseUrl}/${jalur}?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data program studi PTN ${ptnIdentifier}: ${res.statusText}`);
  }
  return res.json();
}
