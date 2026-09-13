"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FilterParams, Jalur } from "@/types";

export function useSearchState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const jalur: Jalur = (searchParams.get("jalur") as Jalur) || "snbp";
  const provinsi = searchParams.get("provinsi") || "";
  const kota = searchParams.get("kota") || "";
  const ptn = searchParams.get("ptn") || "";

  const setFilters = useCallback(
    (newParams: Partial<FilterParams>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (newParams.jalur !== undefined) {
        current.set("jalur", newParams.jalur);
      }
      if (newParams.provinsi !== undefined) {
        if (newParams.provinsi) current.set("provinsi", newParams.provinsi);
        else current.delete("provinsi");
      }
      if (newParams.kota !== undefined) {
        if (newParams.kota) current.set("kota", newParams.kota);
        else current.delete("kota");
      }
      if (newParams.ptn !== undefined) {
        if (newParams.ptn) current.set("ptn", newParams.ptn);
        else current.delete("ptn");
      }

      const query = current.toString();
      const targetPath = pathname === "/search" ? "/search" : "/search";
      router.push(`${targetPath}${query ? `?${query}` : ""}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const clearFilters = useCallback(() => {
    const currentJalur = searchParams.get("jalur") || "snbp";
    router.push(`/search?jalur=${currentJalur}`, { scroll: false });
  }, [router, searchParams]);

  return {
    jalur,
    provinsi,
    kota,
    ptn,
    setFilters,
    clearFilters,
  };
}
