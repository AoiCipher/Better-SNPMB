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
  if (chance <= 5) return "bg-black text-white border-white";
  if (chance <= 15) return "bg-zinc-900 text-zinc-200 border-zinc-700";
  if (chance <= 30) return "bg-zinc-950 text-zinc-300 border-zinc-800";
  return "bg-white text-black border-white";
}

export function getChanceDescription(chance: number): string {
  if (chance <= 5) return "Sangat Ketat (≤ 5%)";
  if (chance <= 15) return "Ketat (5% - 15%)";
  if (chance <= 30) return "Sedang (15% - 30%)";
  return "Cukup Kompetitif (> 30%)";
}
