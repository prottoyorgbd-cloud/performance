import * as React from "react";
import { cn } from "../utils/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm shadow-slate-200/50 backdrop-blur",
        className
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium text-slate-700", className)}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100",
        className
      )}
      {...props}
    />
  );
}

export function HelperText({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-500", className)} {...props} />
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const styles =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-200"
      : variant === "danger"
        ? "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-200"
        : "bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-200";

  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-transparent px-4 text-sm font-semibold shadow-sm outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
        styles,
        variant !== "primary" && "border-slate-200",
        className
      )}
      {...props}
    />
  );
}

export function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-slate-200",
        className
      )}
      aria-label="progress"
      aria-valuenow={v}
      role="progressbar"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "green" | "amber" | "rose" | "indigo";
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "amber"
        ? "bg-amber-50 text-amber-800 border-amber-200"
        : tone === "rose"
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : tone === "indigo"
            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
            : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClass
      )}
    >
      {children}
    </span>
  );
}
