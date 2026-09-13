import { AlertTriangle, ExternalLink } from "lucide-react";

interface DisclaimerAlertProps {
  compact?: boolean;
}

export function DisclaimerAlert({ compact = false }: DisclaimerAlertProps) {
  if (compact) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <AlertTriangle className="w-4 h-4 text-white shrink-0" />
          <span className="truncate">Data berasal dari API tidak resmi (bukan bagian dari SNPMB).</span>
        </div>
        <a
          href="https://snpmb.id/snbp/daya-tampung-snbp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-zinc-300 font-semibold underline underline-offset-2 flex items-center gap-1 shrink-0"
        >
          Resmi <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-zinc-300 shadow-sm my-4">
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h4 className="font-bold text-white flex items-center gap-2 tracking-tight text-sm sm:text-base">
            Pernyataan Penyangkalan (Disclaimer)
          </h4>
          <p className="leading-relaxed text-zinc-400 text-xs sm:text-sm">
            Data pada website ini berasal dari API tidak resmi dan website ini tidak berafiliasi dengan atau merupakan bagian dari SNPMB. Data hanya untuk eksplorasi dan informasi. Selalu verifikasi informasi penting melalui sumber resmi SNPMB.
          </p>
          <div className="pt-1">
            <a
              href="https://snpmb.id/snbp/daya-tampung-snbp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-white hover:text-zinc-300 underline underline-offset-2"
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
