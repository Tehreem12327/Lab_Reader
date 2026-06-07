"use client";

import { useEffect, useState } from "react";

interface FileMetricsProps {
  file: File | null;
  locale: "en" | "ur";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getTypeLabel(type: string): string {
  if (type === "application/pdf") return "PDF";
  if (type === "image/png") return "PNG";
  if (type === "image/jpeg") return "JPEG";
  return type.split("/")[1]?.toUpperCase() ?? "FILE";
}

function getTypeColor(type: string): string {
  if (type === "application/pdf") return "text-rose-400 bg-rose-500/15";
  if (type === "image/png") return "text-sky-400 bg-sky-500/15";
  if (type === "image/jpeg") return "text-amber-400 bg-amber-500/15";
  return "text-gray-400 bg-gray-500/15";
}

export default function FileMetrics({ file, locale }: FileMetricsProps) {
  const [progress, setProgress] = useState(0);

  const labels = {
    title: locale === "ur" ? "فائل کی معلومات" : "File Details",
    name: locale === "ur" ? "نام" : "Name",
    size: locale === "ur" ? "سائز" : "Size",
    type: locale === "ur" ? "قسم" : "Type",
    uploading: locale === "ur" ? "اپ لوڈ ہو رہا ہے..." : "Processing...",
    ready: locale === "ur" ? "تیار ہے" : "Ready",
  };

  useEffect(() => {
    if (!file) {
      setProgress(0);
      return;
    }
    // Reset then animate progress
    setProgress(0);
    const timeout = setTimeout(() => setProgress(100), 50);
    return () => clearTimeout(timeout);
  }, [file]);

  if (!file) return null;

  return (
    <div className="fade-in-up rounded-2xl border border-white/10 bg-white/5 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-emerald-400" aria-hidden="true">
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {labels.title}
          </span>
        </div>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            progress === 100
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-amber-500/15 text-amber-400"
          }`}
        >
          {progress === 100 ? labels.ready : labels.uploading}
        </span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="rounded-xl bg-white/5 p-2.5">
          <p className="text-[10px] text-gray-500 mb-1">{labels.name}</p>
          <p className="text-xs font-medium text-gray-200 truncate" title={file.name}>
            {file.name}
          </p>
        </div>
        <div className="rounded-xl bg-white/5 p-2.5">
          <p className="text-[10px] text-gray-500 mb-1">{labels.size}</p>
          <p className="text-xs font-medium text-gray-200">{formatSize(file.size)}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-2.5">
          <p className="text-[10px] text-gray-500 mb-1">{labels.type}</p>
          <span
            className={`inline-block text-xs font-bold px-1.5 py-0.5 rounded-md ${getTypeColor(file.type)}`}
          >
            {getTypeLabel(file.type)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-gray-500">
            {locale === "ur" ? "اپ لوڈ پیشرفت" : "Upload Progress"}
          </span>
          <span className="text-[10px] font-mono text-emerald-400">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all ease-out"
            style={{
              width: `${progress}%`,
              transitionDuration: "1200ms",
            }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
}
