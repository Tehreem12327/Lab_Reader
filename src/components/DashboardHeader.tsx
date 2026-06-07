"use client";

interface DashboardHeaderProps {
  locale: "en" | "ur";
  onLocaleChange: (locale: "en" | "ur") => void;
}

export default function DashboardHeader({
  locale,
  onLocaleChange,
}: DashboardHeaderProps) {
  const t = {
    brand: locale === "ur" ? "LabReader" : "LabReader",
    tagline:
      locale === "ur"
        ? "AI Lab Report Analyzer"
        : "AI Lab Report Analyzer",
    subtitle:
      locale === "ur"
        ? "Powered by Claude AI"
        : "Powered by Claude AI",
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          {/* Animated logo mark */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-white"
              aria-hidden="true"
            >
              <path
                d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Pulse dot */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-white">
                {t.brand}
              </span>
              <span className="hidden text-xs font-medium text-emerald-400 sm:block">
                {t.tagline}
              </span>
            </div>
            <p className="text-[10px] text-gray-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Status chip + locale toggle */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">
              {locale === "ur" ? "Live" : "Live"}
            </span>
          </div>

          {/* EN | UR toggle */}
          <div
            role="group"
            aria-label="Language selection"
            className="flex overflow-hidden rounded-lg border border-white/15 bg-white/5"
          >
            <button
              onClick={() => onLocaleChange("en")}
              aria-pressed={locale === "en"}
              aria-label="Switch to English"
              className={`px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                locale === "en"
                  ? "bg-emerald-500 text-white shadow-inner"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLocaleChange("ur")}
              aria-pressed={locale === "ur"}
              aria-label="Urdu زبان میں تبدیل کریں"
              className={`px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                locale === "ur"
                  ? "bg-emerald-500 text-white shadow-inner"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              UR
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
