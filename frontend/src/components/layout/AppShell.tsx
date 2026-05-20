import type { ReactNode } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-nexbg flex flex-col">
      <Header />
      <main
        className="flex-1 w-full mx-auto max-w-[1200px] md:px-6"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)",
        }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}