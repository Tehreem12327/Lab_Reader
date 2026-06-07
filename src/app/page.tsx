"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DropzoneCard from "@/components/DropzoneCard";
import FileMetrics from "@/components/FileMetrics";
import QuickDemoSelect from "@/components/QuickDemoSelect";
import UrgencyAlert from "@/components/UrgencyAlert";
import MetricSliderCard from "@/components/MetricSliderCard";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import ExportActionHub from "@/components/ExportActionHub";
import LoadingOverlay from "@/components/LoadingOverlay";
import EmptyState from "@/components/EmptyState";
import Toast from "@/components/Toast";
import { analyzeReport, sortMetricsBySeverity } from "@/services/claudeService";
import type { AnalysisResult, Scenario } from "@/services/claudeService";

export default function Page() {
  // ─── Global State ──────────────────────────────────────────────────────
  const [locale, setLocale] = useState<"en" | "ur">("en");
  const [activeScenario, setActiveScenario] = useState<Scenario>("A");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Hook: Toast auto-dismiss ──────────────────────────────────────────
  const fireToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // ─── Hook: Scenario selection clears stale results ────────────────────
  const handleScenarioSelect = useCallback((scenario: Scenario) => {
    setActiveScenario(scenario);
    setAnalysisResult(null);
  }, []);

  // ─── Hook: Locale toggle — no state loss ──────────────────────────────
  const handleLocaleChange = useCallback((newLocale: "en" | "ur") => {
    setLocale(newLocale);
  }, []);

  // ─── Hook: File accepted ───────────────────────────────────────────────
  const handleFileAccepted = useCallback((file: File) => {
    setUploadedFile(file);
    setAnalysisResult(null);
  }, []);

  // ─── Hook: Analysis trigger ────────────────────────────────────────────
  const handleAnalyze = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setLoadingStep(0);
    setAnalysisResult(null);

    // Start loading message cycle at 650ms intervals
    let stepCounter = 0;
    intervalRef.current = setInterval(() => {
      stepCounter += 1;
      setLoadingStep(stepCounter % 4);
    }, 650);

    try {
      // Read the uploaded file as text so the service can run keyword detection.
      // Falls back to empty string for binary files (images) — pattern match won't trigger.
      let uploadedText = "";
      if (uploadedFile) {
        const { readFileAsText } = await import("@/services/claudeService");
        uploadedText = await readFileAsText(uploadedFile);
      }
      const result = await analyzeReport(activeScenario, uploadedText || undefined);
      setAnalysisResult(result);
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setLoadingStep(0);
      setIsLoading(false);
    }
  }, [isLoading, activeScenario, uploadedFile]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // ─── Keyboard shortcuts ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        handleAnalyze();
      }
      if (e.key === "Escape") {
        setToastMessage(null);
      }
      if (e.key === "1") handleScenarioSelect("A");
      if (e.key === "2") handleScenarioSelect("B");
      if (e.key === "3") handleScenarioSelect("C");
      if (e.key === "l" || e.key === "L") {
        setLocale((prev) => (prev === "en" ? "ur" : "en"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleAnalyze, handleScenarioSelect]);

  // ─── Sort: critical severity first (high → low → normal) ─────────────
  const sortedMetrics = analysisResult
    ? sortMetricsBySeverity(analysisResult.metrics)
    : [];

  // ─── Button labels ─────────────────────────────────────────────────────
  const analyzeLabel =
    locale === "ur"
      ? "🔍 Claude AI سے تجزیہ کریں"
      : "🔍 Analyze Report with Claude AI";

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay step={loadingStep} locale={locale} />}

      {/* Toast */}
      <Toast message={toastMessage} />

      {/* Header */}
      <DashboardHeader locale={locale} onLocaleChange={handleLocaleChange} />

      {/* Main grid */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full lg:grid lg:grid-cols-2 lg:h-[calc(100vh-64px)]">

          {/* ═══════════════════════════════════════════════════════════════
              LEFT COLUMN — Upload & Demo Workspace
          ════════════════════════════════════════════════════════════════ */}
          <section
            aria-label={locale === "ur" ? "Upload Workspace" : "Upload Workspace"}
            className="flex flex-col gap-4 overflow-y-auto border-b border-white/8 p-4 sm:p-6 lg:border-b-0 lg:border-r"
          >
            {/* Section heading */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                {locale === "ur" ? "اپ لوڈ اور ڈیمو ورک اسپیس" : "Upload & Demo Workspace"}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Dropzone */}
            <DropzoneCard
              onFileAccepted={handleFileAccepted}
              locale={locale}
              disabled={isLoading}
            />

            {/* File metrics (shown after upload) */}
            <FileMetrics file={uploadedFile} locale={locale} />

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-[10px] uppercase tracking-widest text-gray-600">
                {locale === "ur" ? "یا" : "or"}
              </span>
              <div className="h-px flex-1 bg-white/8" />
            </div>

            {/* Quick demo selector */}
            <QuickDemoSelect
              activeScenario={activeScenario}
              onSelect={handleScenarioSelect}
              locale={locale}
              disabled={isLoading}
            />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              aria-label={analyzeLabel}
              aria-busy={isLoading}
              className={`
                glow-btn w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500
                px-6 py-4 text-sm font-bold text-white
                focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
                transition-all duration-200
                ${isLoading ? "cursor-not-allowed opacity-50" : "hover:from-emerald-400 hover:to-teal-400"}
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="spinner h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="40 20"
                      strokeLinecap="round"
                    />
                  </svg>
                  {locale === "ur" ? "تجزیہ ہو رہا ہے..." : "Analyzing..."}
                </span>
              ) : (
                analyzeLabel
              )}
            </button>

            {/* Keyboard shortcut hint */}
            <p className="text-center text-[10px] text-gray-700">
              {locale === "ur"
                ? "شارٹ کٹ: Ctrl+Enter | سیمپلز: 1، 2، 3 | زبان: L"
                : "Shortcut: Ctrl+Enter · Scenarios: 1, 2, 3 · Toggle lang: L"}
            </p>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              RIGHT COLUMN — Real-Time Analytics Results
          ════════════════════════════════════════════════════════════════ */}
          <section
            aria-label={locale === "ur" ? "Analytics Results" : "Analytics Results"}
            className="flex flex-col gap-4 overflow-y-auto p-4 sm:p-6"
          >
            {/* Section heading */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                {locale === "ur" ? "AI Analytics Engine" : "AI Analytics Engine"}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {!analysisResult ? (
              /* Empty state */
              <EmptyState locale={locale} />
            ) : (
              /* Results */
              <>
                {/* Urgency alert */}
                <UrgencyAlert urgency={analysisResult.urgency} locale={locale} />

                {/* Summary card */}
                <div className="fade-in-up rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                    {locale === "ur" ? "خلاصہ" : "Summary"}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {locale === "ur"
                      ? analysisResult.summary_urdu
                      : analysisResult.summary}
                  </p>
                </div>

                {/* Metric cards */}
                <div className="flex flex-col gap-3 stagger-children">
                  {sortedMetrics.map((metric, i) => (
                    <MetricSliderCard
                      key={metric.id}
                      metric={metric}
                      locale={locale}
                      index={i}
                    />
                  ))}
                </div>

                {/* Export hub */}
                <ExportActionHub
                  result={analysisResult}
                  locale={locale}
                  onToast={fireToast}
                />
              </>
            )}

            {/* Medical disclaimer — always visible */}
            <div className="mt-auto pt-2">
              <MedicalDisclaimer locale={locale} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
