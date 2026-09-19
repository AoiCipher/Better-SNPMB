import { AlertTriangle, ExternalLink } from "lucide-react";

interface DisclaimerAlertProps {
  compact?: boolean;
}

export function DisclaimerAlert({ compact = false }: DisclaimerAlertProps) {
  if (compact) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3 shadow-xs transition-colors">
        <div className="flex items-center gap-2 overflow-hidden">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="truncate">Data berasal dari API tidak resmi (bukan bagian dari SNPMB).</span>
        </div>
        <a
          href="https://snpmb.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-zinc-300 font-semibold underline underline-offset-2 flex items-center gap-1 shrink-0"
        >
          Resmi <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 shadow-sm my-4 transition-colors">
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 rounded-xl text-amber-700 dark:text-white shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight text-sm sm:text-base">
            Pernyataan Penyangkalan (Disclaimer)
          </h4>
          <p className="leading-relaxed text-slate-600 dark:text-zinc-400 text-xs sm:text-sm">
            Data pada website ini berasal dari API tidak resmi dan website ini tidak berafiliasi dengan atau merupakan bagian dari SNPMB. Data hanya untuk eksplorasi dan informasi. Selalu verifikasi informasi penting melalui sumber resmi SNPMB.
          </p>
          <div className="pt-1">
            <a
              href="https://snpmb.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-zinc-300 underline underline-offset-2"
            >
              Kunjungi Portal Resmi Daya Tampung SNPMB
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
