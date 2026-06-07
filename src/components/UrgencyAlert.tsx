"use client";

import type { UrgencyLevel } from "@/services/claudeService";

interface UrgencyAlertProps {
  urgency: UrgencyLevel;
  locale: "en" | "ur";
}

const CONFIG = {
  critical: {
    icon: "🚨",
    labelEn: "Critical Concern",
    labelUr: "خطرناک حالت",
    descEn:
      "One or more values are critically outside the normal range. Immediate medical consultation is strongly advised.",
    descUr:
      "ایک یا زیادہ اقدار خطرناک طور پر نارمل حد سے باہر ہیں۔ فوری طور پر ڈاکٹر سے ملنا انتہائی ضروری ہے۔",
    bg: "bg-red-950/60",
    border: "border-red-500/60",
    iconBg: "bg-red-500/20",
    badge: "bg-red-500 text-white",
    text: "text-red-200",
    titleColor: "text-red-300",
    glow: "shadow-red-500/20",
  },
  attention: {
    icon: "⚠️",
    labelEn: "Attention Required",
    labelUr: "توجہ دیں",
    descEn:
      "Some values are outside the normal range and warrant a follow-up with your healthcare provider.",
    descUr:
      "کچھ اقدار نارمل حد سے باہر ہیں۔ اپنے ڈاکٹر سے فالو اپ ضرور کریں۔",
    bg: "bg-amber-950/60",
    border: "border-amber-500/60",
    iconBg: "bg-amber-500/20",
    badge: "bg-amber-500 text-white",
    text: "text-amber-200",
    titleColor: "text-amber-300",
    glow: "shadow-amber-500/20",
  },
  normal: {
    icon: "✅",
    labelEn: "All Normal",
    labelUr: "سب نارمل ہے",
    descEn:
      "All values are within the healthy reference ranges. Your lab report shows an excellent bill of health.",
    descUr:
      "تمام اقدار نارمل حد کے اندر ہیں۔ آپ کی لیب رپورٹ بالکل ٹھیک ہے۔",
    bg: "bg-emerald-950/60",
    border: "border-emerald-500/60",
    iconBg: "bg-emerald-500/20",
    badge: "bg-emerald-500 text-white",
    text: "text-emerald-200",
    titleColor: "text-emerald-300",
    glow: "shadow-emerald-500/20",
  },
};

export default function UrgencyAlert({ urgency, locale }: UrgencyAlertProps) {
  const cfg = CONFIG[urgency];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fade-in-up flex items-start gap-4 rounded-2xl border p-4 shadow-lg ${cfg.bg} ${cfg.border} ${cfg.glow}`}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl text-xl ${cfg.iconBg}`}
        aria-hidden="true"
      >
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className={`text-sm font-bold ${cfg.titleColor}`}>
            {locale === "ur" ? cfg.labelUr : cfg.labelEn}
          </h3>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}
          >
            {urgency === "critical"
              ? locale === "ur"
                ? "خطرناک"
                : "CRITICAL"
              : urgency === "attention"
              ? locale === "ur"
                ? "توجہ"
                : "ATTENTION"
              : locale === "ur"
              ? "نارمل"
              : "NORMAL"}
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${cfg.text}`}>
          {locale === "ur" ? cfg.descUr : cfg.descEn}
        </p>
      </div>
    </div>
  );
}
