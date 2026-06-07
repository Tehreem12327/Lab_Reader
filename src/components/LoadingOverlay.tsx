"use client";

interface LoadingOverlayProps {
  step: number;
  locale: "en" | "ur";
}

const STEPS_EN = [
  "🧠 Initializing optical text vector matrix...",
  "🧪 Cross-referencing global lab ranges...",
  "🌐 Translating chemical metrics to conversational Roman Urdu...",
  "✨ Compiling interactive dashboard telemetry...",
];

const STEPS_UR = [
  "🧠 آپٹیکل ٹیکسٹ ویکٹر میٹرکس شروع ہو رہا ہے...",
  "🧪 گلوبل لیب رینجز سے موازنہ کیا جا رہا ہے...",
  "🌐 کیمیائی اقدار کا اردو میں ترجمہ ہو رہا ہے...",
  "✨ انٹریکٹو ڈیش بورڈ تیار کیا جا رہا ہے...",
];

export default function LoadingOverlay({ step, locale }: LoadingOverlayProps) {
  const steps = locale === "ur" ? STEPS_UR : STEPS_EN;
  const currentStep = steps[step % steps.length];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={locale === "ur" ? "رپورٹ کا تجزیہ ہو رہا ہے..." : "Analyzing report..."}
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/85 backdrop-blur-xl"
    >
      {/* Glowing backdrop blob */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/3 h-64 w-64 rounded-full bg-teal-500/8 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-8 px-6 text-center max-w-sm w-full">
        {/* Circular spinner */}
        <div className="relative flex h-20 w-20 items-center justify-center" aria-hidden="true">
          {/* Outer ring */}
          <svg
            className="spinner absolute h-full w-full"
            viewBox="0 0 80 80"
            fill="none"
          >
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="url(#spinnerGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="180 40"
            />
            <defs>
              <linearGradient id="spinnerGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
          {/* Inner pulse */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
            <span className="text-xl">🔬</span>
            <span className="absolute inset-0 rounded-full animate-ping bg-emerald-500/10" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-lg font-bold text-white mb-1">
            {locale === "ur" ? "رپورٹ کا تجزیہ..." : "Analyzing Report..."}
          </h2>
          <p className="text-sm text-gray-400">
            {locale === "ur"
              ? "Claude AI آپ کی لیب رپورٹ پر کام کر رہا ہے"
              : "Claude AI is processing your lab report"}
          </p>
        </div>

        {/* Step message */}
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <p
            className="text-sm font-medium text-emerald-300 transition-all duration-300"
            aria-live="polite"
          >
            {currentStep}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex gap-2" aria-hidden="true">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step % steps.length
                  ? "w-6 bg-emerald-400"
                  : i < step % steps.length
                  ? "w-1.5 bg-emerald-700"
                  : "w-1.5 bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
