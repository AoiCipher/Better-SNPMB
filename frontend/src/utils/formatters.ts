export function formatNumber(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return "0";
  return new Intl.NumberFormat("id-ID").format(val);
}

export function formatPercent(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return "0%";
  return `${val.toFixed(2)}%`;
}

export function capitalizeWords(str: string | null | undefined): string {
  if (!str || str === "none") return "-";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getChanceBadgeColor(chance: number): string {
  if (chance <= 5) return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200";
  if (chance <= 15) return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200";
  if (chance <= 30) return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200";
  return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200";
}

export function getChanceDescription(chance: number): string {
  if (chance <= 5) return "Sangat Ketat (≤ 5%)";
  if (chance <= 15) return "Ketat (5% - 15%)";
  if (chance <= 30) return "Sedang (15% - 30%)";
  return "Cukup Kompetitif (> 30%)";
}
