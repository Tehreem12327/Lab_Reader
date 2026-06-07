"use client";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="toast-enter fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-gray-900/95 px-5 py-3 shadow-2xl backdrop-blur-xl">
        <p className="text-sm font-medium text-white whitespace-nowrap">{message}</p>
      </div>
    </div>
  );
}
