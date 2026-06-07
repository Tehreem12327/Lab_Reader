"use client";

interface MedicalDisclaimerProps {
  locale: "en" | "ur";
}

export default function MedicalDisclaimer({ locale }: MedicalDisclaimerProps) {
  const text =
    locale === "ur"
      ? "یہ نتائج آرٹیفیشل انٹیلیجنس کے ذریعے بنائے گئے تخمینے ہیں اور یہ پیشہ ورانہ طبی مشورہ نہیں ہیں۔ کسی بھی صحت سے متعلق فیصلے کے لیے اپنے ڈاکٹر سے ضرور ملیں۔"
      : "Results shown are AI-generated simulations and do not constitute professional medical advice. Always consult a qualified healthcare provider for any health-related decisions.";

  const label =
    locale === "ur" ? "⚕️ طبی اعلامیہ" : "⚕️ Medical Disclaimer";

  return (
    <div
      role="contentinfo"
      aria-label="Medical disclaimer"
      className="rounded-xl border border-white/8 bg-white/3 px-4 py-3"
    >
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0 text-sm mt-0.5" aria-hidden="true">
          ⚕️
        </span>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
            {label.replace("⚕️ ", "")}
          </span>
          <p className="text-[11px] leading-relaxed text-gray-500">{text}</p>
        </div>
      </div>
    </div>
  );
}
