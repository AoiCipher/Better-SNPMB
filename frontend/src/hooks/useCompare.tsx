"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Jalur, PTN } from "@/types";

export interface CompareItem {
  ptn: PTN;
  jalur: Jalur;
}

interface CompareContextType {
  compareList: CompareItem[];
  isLoaded: boolean;
  toggleCompare: (ptn: PTN, jalur: Jalur) => boolean;
  isComparing: (ptnId: number) => boolean;
  removeFromCompare: (ptnId: number) => void;
  clearCompare: () => void;
}

const STORAGE_KEY = "better_snpmb_compare_list";

function normalizeItem(rawItem: any): CompareItem | null {
  if (!rawItem || typeof rawItem !== "object") return null;

  // Case 1: Standard format { ptn: { id_ptn: ... }, jalur: "snbp" }
  if (rawItem.ptn && typeof rawItem.ptn.id_ptn === "number") {
    return {
      ptn: rawItem.ptn,
      jalur: rawItem.jalur || "snbp",
    };
  }

  // Case 2: Legacy raw PTN object stored directly { id_ptn: 123, nama: "...", ... }
  if (typeof rawItem.id_ptn === "number" && typeof rawItem.nama === "string") {
    return {
      ptn: rawItem as PTN,
      jalur: rawItem.jalur || "snbp",
    };
  }

  return null;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<CompareItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const valid: CompareItem[] = parsed
            .map(normalizeItem)
            .filter((item): item is CompareItem => item !== null);
          setCompareList(valid);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
          return;
        }
      }
      setCompareList([]);
    } catch {
      setCompareList([]);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadFromStorage();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveList = (newList: CompareItem[]) => {
    const sanitized = newList.filter((item) => item && item.ptn && typeof item.ptn.id_ptn === "number");
    setCompareList(sanitized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } catch {
      // Ignore storage errors
    }
  };

  const toggleCompare = (ptn: PTN, jalur: Jalur): boolean => {
    if (!ptn || typeof ptn.id_ptn !== "number") return false;

    const existingIndex = compareList.findIndex((item) => item?.ptn?.id_ptn === ptn.id_ptn);

    if (existingIndex >= 0) {
      const newList = compareList.filter((item) => item?.ptn?.id_ptn !== ptn.id_ptn);
      saveList(newList);
      return false;
    } else {
      if (compareList.length >= 2) {
        const newList = [compareList[0], { ptn, jalur }];
        saveList(newList);
        return true;
      } else {
        const newList = [...compareList, { ptn, jalur }];
        saveList(newList);
        return true;
      }
    }
  };

  const isComparing = (ptnId: number): boolean => {
    if (typeof ptnId !== "number") return false;
    return compareList.some((item) => item?.ptn?.id_ptn === ptnId);
  };

  const removeFromCompare = (ptnId: number) => {
    if (typeof ptnId !== "number") return;
    const newList = compareList.filter((item) => item?.ptn?.id_ptn !== ptnId);
    saveList(newList);
  };

  const clearCompare = () => {
    saveList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        isLoaded,
        toggleCompare,
        isComparing,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
