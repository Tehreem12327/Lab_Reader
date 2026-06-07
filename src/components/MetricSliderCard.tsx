"use client";

import type { LabMetric } from "@/services/claudeService";

interface MetricSliderCardProps {
  metric: LabMetric;
  locale: "en" | "ur";
  index?: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const STATUS_CONFIG = {
  critical: {
    labelEn: "Critical",
    labelUr: "خطرناک",
    indicatorColor: "bg-red-500",
    trackColor: "bg-red-600/40",
    badgeBg: "bg-red-600/20 text-red-300 border-red-500/50",
    borderColor: "border-red-500/50",
    iconBg: "bg-red-600/20",
    icon: "⚠",
    iconColor: "text-red-300",
  },
  low: {
    labelEn: "Low",
    labelUr: "کم",
    indicatorColor: "bg-amber-400",
    trackColor: "bg-amber-500/30",
    badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    borderColor: "border-amber-500/30",
    iconBg: "bg-amber-500/15",
    icon: "↓",
    iconColor: "text-amber-400",
  },
  high: {
    labelEn: "High",
    labelUr: "زیادہ",
    indicatorColor: "bg-red-400",
    trackColor: "bg-red-500/30",
    badgeBg: "bg-red-500/15 text-red-400 border-red-500/30",
    borderColor: "border-red-500/30",
    iconBg: "bg-red-500/15",
    icon: "↑",
    iconColor: "text-red-400",
  },
  normal: {
    labelEn: "Normal",
    labelUr: "نارمل",
    indicatorColor: "bg-emerald-400",
    trackColor: "bg-emerald-500/20",
    badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    borderColor: "border-emerald-500/20",
    iconBg: "bg-emerald-500/15",
    icon: "✓",
    iconColor: "text-emerald-400",
  },
};

export default function MetricSliderCard({
  metric,
  locale,
  index = 0,
}: MetricSliderCardProps) {
  const cfg = STATUS_CONFIG[metric.status];

  // Calculate the indicator position as a percentage (0–100%)
  const rawPct =
    ((metric.value - metric.rangeMin) / (metric.rangeMax - metric.rangeMin)) * 100;
  const pct = clamp(rawPct, 2, 96); // keep indicator visible at extremes

  const animDelay = `${index * 80}ms`;

  return (
    <div
      className={`fade-in-up rounded-2xl border bg-white/5 p-4 transition-all duration-300 hover:bg-white/8 ${cfg.borderColor}`}
      style={{ animationDelay: animDelay }}
    >
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold ${cfg.iconBg} ${cfg.iconColor}`}
            aria-hidden="true"
          >
            {cfg.icon}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-gray-100 truncate">
              {locale === "ur" ? metric.name_urdu : metric.name}
            </h4>
            <p className="text-[10px] text-gray-500">
              {locale === "ur"
                ? `Range: ${metric.rangeMin}–${metric.rangeMax} ${metric.unit}`
                : `Range: ${metric.rangeMin}–${metric.rangeMax} ${metric.unit}`}
            </p>
          </div>
        </div>

        {/* Value + status badge */}
        <div className="flex-shrink-0 text-right">
          <div className="text-base font-bold text-white tabular-nums">
            {metric.value}
            <span className="ml-1 text-xs font-normal text-gray-400">
              {metric.unit}
            </span>
          </div>
          <span
            className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cfg.badgeBg}`}
          >
            {locale === "ur" ? cfg.labelUr : cfg.labelEn}
          </span>
        </div>
      </div>

      {/* Range slider track */}
      <div className="mb-3" aria-label={`${metric.name} range indicator`}>
        <div className="relative h-2 w-full rounded-full bg-gray-800">
          {/* Normal range highlight */}
          <div
            className={`absolute top-0 h-full rounded-full ${cfg.trackColor}`}
            style={{ left: "0%", width: "100%" }}
            aria-hidden="true"
          />
          {/* Actual patient value indicator */}
          <div
            className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-gray-900 shadow-lg ${cfg.indicatorColor} transition-all duration-700`}
            style={{ left: `${pct}%` }}
            role="img"
            aria-label={`Value ${metric.value} ${metric.unit}`}
          />
        </div>
        {/* Min / Max labels */}
        <div className="mt-1 flex justify-between">
          <span className="text-[9px] text-gray-600 tabular-nums">
            {metric.rangeMin}
          </span>
          <span className="text-[9px] text-gray-600 tabular-nums">
            {metric.rangeMax}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed text-gray-400">
        {locale === "ur" ? metric.description_urdu : metric.description}
      </p>

      {/* Action recommendation */}
      {(metric.action || metric.action_urdu) && (
        <div className={`mt-3 rounded-xl px-3 py-2 ${cfg.iconBg}`}>
          <p className={`text-[11px] font-semibold leading-relaxed ${cfg.iconColor}`}>
            {locale === "ur"
              ? metric.action_urdu ?? metric.action
              : metric.action ?? metric.action_urdu}
          </p>
        </div>
      )}
    </div>
  );
}
