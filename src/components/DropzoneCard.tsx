"use client";

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from "react";

interface DropzoneCardProps {
  onFileAccepted: (file: File) => void;
  locale: "en" | "ur";
  disabled?: boolean;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "application/pdf"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

type DropzoneState = "idle" | "dragover" | "accepted" | "error";

export default function DropzoneCard({
  onFileAccepted,
  locale,
  disabled = false,
}: DropzoneCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<DropzoneState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const labels = {
    title:
      locale === "ur"
        ? "Report Yahan Drop Karein"
        : "Drop Your Report Here",
    subtitle:
      locale === "ur"
        ? "ya click kar ke file chunein"
        : "or click to browse files",
    accepts:
      locale === "ur"
        ? "PNG, JPG, PDF — max 10MB"
        : "PNG · JPG · PDF — max 10MB",
    dragActive:
      locale === "ur"
        ? "File Chhod Dein..."
        : "Release to Upload...",
    accepted:
      locale === "ur"
        ? "File Qabool Ho Gayi ✓"
        : "File Accepted ✓",
    errorType:
      locale === "ur"
        ? "Sirf PNG, JPG ya PDF files qabool hain."
        : "Only PNG, JPG, or PDF files are accepted.",
    errorSize:
      locale === "ur"
        ? "File 10MB se bari nahi honi chahiye."
        : "File must be smaller than 10 MB.",
  };

  const validate = useCallback(
    (file: File): string | null => {
      if (!ACCEPTED_TYPES.includes(file.type)) return labels.errorType;
      if (file.size > MAX_SIZE_BYTES) return labels.errorSize;
      return null;
    },
    [labels.errorType, labels.errorSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      const error = validate(file);
      if (error) {
        setErrorMsg(error);
        setState("error");
        return;
      }
      setErrorMsg("");
      setState("accepted");
      onFileAccepted(file);
    },
    [validate, onFileAccepted]
  );

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setState("dragover");
  };
  const onDragLeave = () => {
    if (!disabled) setState("idle");
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
    else setState("idle");
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const borderColor = {
    idle: "border-gray-700",
    dragover: "border-emerald-500 dropzone-pulse",
    accepted: "border-emerald-500",
    error: "border-red-500",
  }[state];

  const bgColor = {
    idle: "bg-white/5",
    dragover: "bg-emerald-500/10",
    accepted: "bg-emerald-500/10",
    error: "bg-red-500/10",
  }[state];

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={labels.title}
      aria-disabled={disabled}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          inputRef.current?.click();
        }
      }}
      className={`
        relative flex cursor-pointer flex-col items-center justify-center gap-3
        rounded-2xl border-2 border-dashed p-8 text-center
        transition-all duration-300 select-none
        ${borderColor} ${bgColor}
        ${disabled ? "pointer-events-none opacity-50" : "hover:border-emerald-500/60 hover:bg-white/10"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.pdf"
        className="hidden"
        onChange={onChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Icon */}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 ${
          state === "dragover"
            ? "bg-emerald-500/30 text-emerald-300"
            : state === "accepted"
            ? "bg-emerald-500/20 text-emerald-400"
            : state === "error"
            ? "bg-red-500/20 text-red-400"
            : "bg-white/10 text-gray-400"
        }`}
      >
        {state === "accepted" ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : state === "error" ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
            <path
              d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1M12 12V4M8 8l4-4 4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Text */}
      <div>
        <p className="text-sm font-semibold text-gray-200">
          {state === "dragover"
            ? labels.dragActive
            : state === "accepted"
            ? labels.accepted
            : labels.title}
        </p>
        {state === "error" ? (
          <p className="mt-1 text-xs text-red-400" role="alert">
            {errorMsg}
          </p>
        ) : (
          <p className="mt-1 text-xs text-gray-500">
            {state === "accepted" ? "" : labels.subtitle}
          </p>
        )}
      </div>

      {/* Format badges */}
      {state === "idle" && (
        <div className="flex gap-2 mt-1">
          {["PNG", "JPG", "PDF"].map((fmt) => (
            <span
              key={fmt}
              className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500"
            >
              {fmt}
            </span>
          ))}
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono text-gray-600">
            max 10MB
          </span>
        </div>
      )}
    </div>
  );
}
