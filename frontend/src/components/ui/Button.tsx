import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
  loading?: boolean;
}

export default function Button({ children, variant = "primary", loading, disabled, ...props }: Props) {
  const base = "w-full h-12 rounded-xl2 font-bold text-[15px] flex items-center justify-center gap-2 transition active:scale-[.98] disabled:opacity-60 disabled:active:scale-100";
  const styles = variant === "primary"
    ? "bg-nex-grad text-white shadow-lg shadow-violet2/30"
    : "bg-white text-ink border border-silver";
  return (
    <button {...props} disabled={disabled || loading} className={`${base} ${styles}`}>
      {loading && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
      {children}
    </button>
  );
}