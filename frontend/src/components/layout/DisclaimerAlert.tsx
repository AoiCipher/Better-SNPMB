import { AlertTriangle, ExternalLink } from "lucide-react";

interface DisclaimerAlertProps {
  compact?: boolean;
}

export function DisclaimerAlert({ compact = false }: DisclaimerAlertProps) {
  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="truncate">Data berasal dari API tidak resmi (bukan bagian dari SNPMB).</span>
        </div>
        <a
          href="https://snpmb.id/snbp/daya-tampung-snbp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-700 hover:text-amber-900 font-medium underline flex items-center gap-0.5 shrink-0"
        >
          Resmi <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-4 text-xs sm:text-sm text-amber-900 shadow-xs my-4">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-amber-950 flex items-center gap-2">
            Pernyataan Penyangkalan (Disclaimer)
          </h4>
          <p className="leading-relaxed text-amber-800">
            Data pada website ini berasal dari API tidak resmi dan website ini tidak berafiliasi dengan atau merupakan bagian dari SNPMB. Data hanya untuk eksplorasi dan informasi. Selalu verifikasi informasi penting melalui sumber resmi SNPMB.
          </p>
          <div className="pt-1">
            <a
              href="https://snpmb.id/snbp/daya-tampung-snbp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-amber-900 hover:text-amber-950 underline decoration-amber-400 underline-offset-2"
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
