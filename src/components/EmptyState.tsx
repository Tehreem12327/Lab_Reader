"use client";

interface EmptyStateProps {
  locale: "en" | "ur";
}

export default function EmptyState({ locale }: EmptyStateProps) {
  const title =
    locale === "ur"
      ? "نتائج یہاں دکھائے جائیں گے"
      : "Results Will Appear Here";
  const desc =
    locale === "ur"
      ? "بائیں طرف رپورٹ اپ لوڈ کریں یا ڈیمو سیمپل چنیں، پھر Analyze کا بٹن دبائیں۔"
      : "Upload a report on the left or select a demo sample, then click Analyze to see AI-powered insights.";

  return (
    <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-white/10 p-10 text-center">
      {/* Vector sketch illustration */}
      <div className="relative" aria-hidden="true">
        {/* Dashboard skeleton illustration */}
        <svg
          viewBox="0 0 200 160"
          fill="none"
          className="h-40 w-48 opacity-30"
          aria-hidden="true"
        >
          {/* Window frame */}
          <rect x="10" y="10" width="180" height="140" rx="10" stroke="#6b7280" strokeWidth="1.5" />
          {/* Top bar */}
          <rect x="10" y="10" width="180" height="28" rx="10" fill="#374151" />
          <circle cx="28" cy="24" r="5" fill="#4b5563" />
          <circle cx="43" cy="24" r="5" fill="#4b5563" />
          <circle cx="58" cy="24" r="5" fill="#4b5563" />
          {/* Metric cards skeleton */}
          <rect x="22" y="50" width="72" height="36" rx="6" fill="#1f2937" />
          <rect x="28" y="57" width="40" height="4" rx="2" fill="#374151" />
          <rect x="28" y="66" width="28" height="4" rx="2" fill="#374151" />
          <rect x="28" y="75" width="56" height="3" rx="1.5" fill="#374151" />
          <rect x="106" y="50" width="72" height="36" rx="6" fill="#1f2937" />
          <rect x="112" y="57" width="40" height="4" rx="2" fill="#374151" />
          <rect x="112" y="66" width="28" height="4" rx="2" fill="#374151" />
          <rect x="112" y="75" width="56" height="3" rx="1.5" fill="#374151" />
          {/* Bottom card */}
          <rect x="22" y="98" width="156" height="36" rx="6" fill="#1f2937" />
          <rect x="30" y="108" width="60" height="4" rx="2" fill="#374151" />
          <rect x="30" y="117" width="120" height="3" rx="1.5" fill="#374151" />
          {/* Animated pulse line */}
          <path
            d="M22 88 Q50 80 70 88 Q90 96 110 88 Q130 80 158 88"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>

        {/* Centered pulse dot */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15">
          <div className="h-3 w-3 rounded-full bg-emerald-500/50 animate-pulse" />
        </div>
      </div>

      {/* Text */}
      <div>
        <h3 className="text-base font-semibold text-gray-300 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{desc}</p>
      </div>

      {/* Tip pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          locale === "ur" ? "🔬 سیمپل A چنیں" : "🔬 Select Sample A",
          locale === "ur" ? "🚨 سیمپل B آزمائیں" : "🚨 Try Sample B",
          locale === "ur" ? "📁 فائل اپ لوڈ کریں" : "📁 Upload a file",
        ].map((tip) => (
          <span
            key={tip}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-500"
          >
            {tip}
          </span>
        ))}
      </div>
    </div>
  );
}
