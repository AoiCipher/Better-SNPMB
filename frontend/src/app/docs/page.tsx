"use client";

import { useState } from "react";
import { Check, Copy, Terminal, Code2, Server, ShieldCheck, Zap } from "lucide-react";

export default function ApiDocsPage() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const endpoints = [
    {
      id: "health",
      method: "GET",
      path: "/health",
      title: "Health Check",
      desc: "Memeriksa status dan kesehatan server API.",
      params: [],
      exampleUrl: `${baseUrl}health`,
      curl: `curl -X GET "${baseUrl}health"`,
      js: `fetch("${baseUrl}health")\n  .then(res => res.json())\n  .then(data => console.log(data));`,
      response: `{\n  "status": "ok"\n}`,
    },
    {
      id: "snbp",
      method: "GET",
      path: "/snbp",
      title: "Data SNBP (Seleksi Nasional Berdasarkan Prestasi)",
      desc: "Mengambil daftar PTN atau detail Program Studi untuk jalur SNBP.",
      params: [
        { name: "provinsi", type: "string", required: false, desc: "Filter berdasarkan nama provinsi (contoh: JAWA BARAT)" },
        { name: "kota", type: "string", required: false, desc: "Filter berdasarkan nama kota/kabupaten (contoh: BANDUNG)" },
        { name: "ptn", type: "string", required: false, desc: "Kode/ID PTN untuk mengambil daftar prodi (contoh: 332)" },
      ],
      exampleUrl: `${baseUrl}snbp?provinsi=JAWA%20BARAT`,
      curl: `curl -X GET "${baseUrl}snbp?provinsi=JAWA%20BARAT"`,
      js: `fetch("${baseUrl}snbp?provinsi=JAWA%20BARAT")\n  .then(res => res.json())\n  .then(data => console.log(data));`,
      response: `[\n  {\n    "code": "332",\n    "name": "INSTITUT TEKNOLOGI BANDUNG",\n    "provinsi": "JAWA BARAT",\n    "kota": "KOTA BANDUNG"\n  }\n]`,
    },
    {
      id: "snbt",
      method: "GET",
      path: "/snbt",
      title: "Data SNBT (Seleksi Nasional Berdasarkan Tes)",
      desc: "Mengambil daftar PTN atau detail Program Studi untuk jalur SNBT.",
      params: [
        { name: "provinsi", type: "string", required: false, desc: "Filter berdasarkan nama provinsi" },
        { name: "kota", type: "string", required: false, desc: "Filter berdasarkan nama kota/kabupaten" },
        { name: "ptn", type: "string", required: false, desc: "Kode/ID PTN untuk mengambil daftar prodi" },
      ],
      exampleUrl: `${baseUrl}snbt?ptn=332`,
      curl: `curl -X GET "${baseUrl}snbt?ptn=332"`,
      js: `fetch("${baseUrl}snbt?ptn=332")\n  .then(res => res.json())\n  .then(data => console.log(data));`,
      response: `[\n  {\n    "code": "3321014",\n    "name": "TEKNIK INFORMATIKA",\n    "jenjang": "S1",\n    "kuota": 80,\n    "peminat": 2500\n  }\n]`,
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 dark:text-white py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="space-y-4 text-center sm:text-left border-b border-slate-200 dark:border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5" /> 100% Gratis & Terbuka Tanpa API Key
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dokumentasi REST API B-SNPMB
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl">
            API publik untuk mengakses data PTN, Program Studi, Daya Tampung, Peminat, dan tingkat persaingan SNBP & SNBT resmi.
          </p>
        </div>

        {/* Overview & Rate Limit info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
              <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Base URL
            </div>
            <code className="text-xs font-mono bg-slate-900 text-slate-100 dark:bg-black dark:text-zinc-300 px-2.5 py-1.5 rounded block overflow-x-auto border border-slate-800 dark:border-zinc-800/80">
              {baseUrl}
            </code>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Autentikasi
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Tidak memerlukan API Key. API bebas digunakan oleh publik secara langsung.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
              <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Batasan Rate Limit
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Batas request: <strong className="text-slate-900 dark:text-zinc-200">5 request / detik</strong> per IP address.
            </p>
          </div>
        </div>

        {/* Endpoints List */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Endpoint Publik
          </h2>

          {endpoints.map((ep) => (
            <div key={ep.id} className="bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-sm dark:shadow-md">

              {/* Endpoint Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-bold font-mono rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {ep.method}
                  </span>
                  <span className="font-mono text-base font-semibold text-slate-900 dark:text-white">
                    {ep.path}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-zinc-400">{ep.title}</span>
              </div>

              <p className="text-sm text-slate-700 dark:text-zinc-300">{ep.desc}</p>

              {/* Query Parameters */}
              {ep.params.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-zinc-400 tracking-wider">
                    Query Parameters
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400">
                          <th className="py-2 px-3 font-semibold">Parameter</th>
                          <th className="py-2 px-3 font-semibold">Tipe</th>
                          <th className="py-2 px-3 font-semibold">Wajib</th>
                          <th className="py-2 px-3 font-semibold">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 text-slate-700 dark:text-zinc-300">
                        {ep.params.map((p) => (
                          <tr key={p.name}>
                            <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{p.name}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-zinc-400">{p.type}</td>
                            <td className="py-2.5 px-3 text-slate-500 dark:text-zinc-400">{p.required ? "Ya" : "Opsional"}</td>
                            <td className="py-2.5 px-3 text-slate-500 dark:text-zinc-400">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Code Snippets */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-zinc-400 tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> Contoh Request (cURL)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(ep.curl, `${ep.id}-curl`)}
                    className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {copiedIndex === `${ep.id}-curl` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Salin cURL
                      </>
                    )}
                  </button>
                </div>

                <pre className="bg-slate-900 text-emerald-300 dark:bg-black dark:text-emerald-300 p-4 rounded-xl font-mono text-xs border border-slate-800 dark:border-zinc-800/80 overflow-x-auto">
                  {ep.curl}
                </pre>

                <div className="flex items-center justify-between pt-2">
                  <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-zinc-400 tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" /> JavaScript (fetch)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(ep.js, `${ep.id}-js`)}
                    className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {copiedIndex === `${ep.id}-js` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Salin Code
                      </>
                    )}
                  </button>
                </div>

                <pre className="bg-slate-900 text-slate-100 dark:bg-black dark:text-zinc-300 p-4 rounded-xl font-mono text-xs border border-slate-800 dark:border-zinc-800/80 overflow-x-auto">
                  {ep.js}
                </pre>

                {/* Example Response */}
                <div className="pt-2 space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-zinc-400 tracking-wider">
                    Contoh Respon (JSON)
                  </h4>
                  <pre className="bg-slate-900 text-blue-300 dark:bg-black dark:text-blue-300 p-4 rounded-xl font-mono text-xs border border-slate-800 dark:border-zinc-800/80 overflow-x-auto">
                    {ep.response}
                  </pre>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
