"use client";

import type { AnalysisResult } from "@/services/claudeService";

interface ExportActionHubProps {
  result: AnalysisResult | null;
  locale: "en" | "ur";
  onToast: (message: string) => void;
}

function buildTextSummary(result: AnalysisResult, locale: "en" | "ur"): string {
  const lines: string[] = [];

  if (locale === "ur") {
    lines.push("=== LabReader — AI Lab Report ===");
    lines.push(
      `Overall: ${
        result.urgency === "critical"
          ? "خطرناک"
          : result.urgency === "attention"
          ? "توجہ دیں"
          : "سب نارمل"
      }`
    );
    lines.push("");
    lines.push(result.summary_urdu);
    lines.push("");
    result.metrics.forEach((m) => {
      lines.push(`${m.name_urdu}: ${m.value} ${m.unit}`);
      lines.push(
        `  حالت: ${
          m.status === "critical"
            ? "خطرناک"
            : m.status === "low"
            ? "کم"
            : m.status === "high"
            ? "زیادہ"
            : "نارمل"
        }`
      );
      lines.push(`  حد: ${m.rangeMin}–${m.rangeMax} ${m.unit}`);
      lines.push(`  ${m.description_urdu}`);
      if (m.action_urdu) lines.push(`  تجویز: ${m.action_urdu}`);
      lines.push("");
    });
  } else {
    lines.push("=== LabReader — AI Lab Report ===");
    lines.push(
      `Overall: ${
        result.urgency === "critical"
          ? "Critical Concern"
          : result.urgency === "attention"
          ? "Attention Required"
          : "All Normal"
      }`
    );
    lines.push("");
    lines.push(result.summary);
    lines.push("");
    result.metrics.forEach((m) => {
      lines.push(`${m.name}: ${m.value} ${m.unit}`);
      lines.push(
        `  Status: ${m.status.charAt(0).toUpperCase() + m.status.slice(1)}`
      );
      lines.push(`  Reference Range: ${m.rangeMin}–${m.rangeMax} ${m.unit}`);
      lines.push(`  ${m.description}`);
      if (m.action) lines.push(`  Recommended Action: ${m.action}`);
      lines.push("");
    });
  }

  lines.push("---");
  lines.push(
    locale === "ur"
      ? "یہ نتائج AI کے تخمینے ہیں، اصل طبی مشورہ نہیں ہیں۔"
      : "Results are AI-generated simulations. Not a substitute for medical advice."
  );

  return lines.join("\n");
}

export default function ExportActionHub({
  result,
  locale,
  onToast,
}: ExportActionHubProps) {
  const labels = {
    copy: locale === "ur" ? "📋 متن کاپی کریں" : "📋 Copy Text Breakdown",
    share: locale === "ur" ? "📤 نتیجہ شیئر کریں" : "📤 Share Results",
    copiedOk: locale === "ur" ? "✅ کلپ بورڈ میں کاپی ہو گیا!" : "✅ Copied to clipboard!",
    copiedFail: locale === "ur" ? "❌ کاپی نہیں ہوا۔ دوبارہ کوشش کریں۔" : "❌ Copy failed. Please try again.",
    sharedOk: locale === "ur" ? "✅ نتیجہ شیئر ہو گیا!" : "✅ Results shared!",
  };

  const disabled = !result;

  async function handleCopy() {
    if (!result) return;
    const text = buildTextSummary(result, locale);
    try {
      await navigator.clipboard.writeText(text);
      onToast(labels.copiedOk);
    } catch {
      onToast(labels.copiedFail);
    }
  }

  async function handleShare() {
    if (!result) return;
    const text = buildTextSummary(result, locale);
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title: "LabReader Results",
          text,
        });
        onToast(labels.sharedOk);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(text);
        onToast(labels.copiedOk);
      }
    } catch {
      // User cancelled share or clipboard failed — silent
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopy}
        disabled={disabled}
        aria-label={labels.copy}
        className={`
          flex flex-1 items-center justify-center gap-2 rounded-xl border
          px-3 py-2.5 text-xs font-semibold transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
          ${
            disabled
              ? "border-white/5 bg-white/3 text-gray-600 cursor-not-allowed"
              : "border-white/15 bg-white/8 text-gray-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300 active:scale-95"
          }
        `}
      >
        <span aria-hidden="true">📋</span>
        <span className="truncate">{labels.copy.replace("📋 ", "")}</span>
      </button>

      <button
        onClick={handleShare}
        disabled={disabled}
        aria-label={labels.share}
        className={`
          flex flex-1 items-center justify-center gap-2 rounded-xl border
          px-3 py-2.5 text-xs font-semibold transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
          ${
            disabled
              ? "border-white/5 bg-white/3 text-gray-600 cursor-not-allowed"
              : "border-white/15 bg-white/8 text-gray-300 hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-300 active:scale-95"
          }
        `}
      >
        <span aria-hidden="true">📤</span>
        <span className="truncate">{labels.share.replace("📤 ", "")}</span>
      </button>
    </div>
  );
}
