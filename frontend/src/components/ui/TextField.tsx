import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function TextField({ label, ...props }: Props) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-ink mb-1.5">{label}</span>
      <input
        {...props}
        className="w-full h-12 px-4 rounded-xl2 bg-white border border-silver/70 text-ink placeholder:text-sub/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
      />
    </label>
  );
}