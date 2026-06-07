"use client";

import type { Scenario } from "@/services/claudeService";

interface QuickDemoSelectProps {
  activeScenario: Scenario;
  onSelect: (scenario: Scenario) => void;
  locale: "en" | "ur";
  disabled?: boolean;
}

const TABS: {
  scenario: Scenario;
  icon: string;
  labelEn: string;
  labelUr: string;
  descEn: string;
  descUr: string;
  color: string;
  activeColor: string;
}[] = [
  {
    scenario: "A",
    icon: "🔬",
    labelEn: "Test Sample A",
    labelUr: "سیمپل A",
    descEn: "Attention",
    descUr: "توجہ",
    color: "border-amber-500/40 hover:border-amber-500/70 hover:bg-amber-500/10",
    activeColor: "border-amber-500 bg-amber-500/15 shadow-amber-500/20",
  },
  {
    scenario: "B",
    icon: "🚨",
    labelEn: "Test Sample B",
    labelUr: "سیمپل B",
    descEn: "Critical",
    descUr: "خطرناک",
    color: "border-red-500/40 hover:border-red-500/70 hover:bg-red-500/10",
    activeColor: "border-red-500 bg-red-500/15 shadow-red-500/20",
  },
  {
    scenario: "C",
    icon: "✅",
    labelEn: "Test Sample C",
    labelUr: "سیمپل C",
    descEn: "All Normal",
    descUr: "سب نارمل",
    color: "border-emerald-500/40 hover:border-emerald-500/70 hover:bg-emerald-500/10",
    activeColor: "border-emerald-500 bg-emerald-500/15 shadow-emerald-500/20",
  },
];

export default function QuickDemoSelect({
  activeScenario,
  onSelect,
  locale,
  disabled = false,
}: QuickDemoSelectProps) {
  const header =
    locale === "ur"
      ? "ڈیمو سیمپلز — ایک چنیں"
      : "Quick Demo — Select a Sample";

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {header}
      </p>
      <div
        role="tablist"
        aria-label={header}
        className="grid grid-cols-3 gap-2"
      >
        {TABS.map((tab) => {
          const isActive = activeScenario === tab.scenario;
          return (
            <button
              key={tab.scenario}
              role="tab"
              aria-selected={isActive}
              aria-label={`${locale === "ur" ? tab.labelUr : tab.labelEn} — ${locale === "ur" ? tab.descUr : tab.descEn}`}
              onClick={() => !disabled && onSelect(tab.scenario)}
              disabled={disabled}
              className={`
                flex flex-col items-center gap-1 rounded-xl border px-2 py-3
                text-center transition-all duration-200 shadow-sm
                focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
                ${disabled ? "pointer-events-none opacity-40" : ""}
                ${isActive ? `${tab.activeColor} shadow-lg` : `border-white/10 bg-white/5 ${tab.color}`}
              `}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="text-[11px] font-semibold text-gray-200 leading-tight">
                {locale === "ur" ? tab.labelUr : tab.labelEn}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isActive
                    ? tab.scenario === "A"
                      ? "text-amber-400"
                      : tab.scenario === "B"
                      ? "text-red-400"
                      : "text-emerald-400"
                    : "text-gray-500"
                }`}
              >
                {locale === "ur" ? tab.descUr : tab.descEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
