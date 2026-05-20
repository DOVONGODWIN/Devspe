import type { ReactNode } from "react";
import { ShoppingBag } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }: {
  title: string; subtitle: string; children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-nexbg flex flex-col">
      <div className="bg-nex-grad pt-12 pb-16 px-6 rounded-b-[36px]"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 48px)" }}>
        <div className="mx-auto max-w-md flex flex-col items-center text-center">
          <span className="grid place-items-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur mb-4">
            <ShoppingBag size={30} color="#fff" />
          </span>
          <h1 className="text-white text-2xl font-extrabold">{title}</h1>
          <p className="text-white/80 text-sm mt-1">{subtitle}</p>
        </div>
      </div>
      <div className="flex-1 px-6 -mt-8">
        <div className="mx-auto max-w-md bg-white rounded-[28px] shadow-xl shadow-ink/5 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}