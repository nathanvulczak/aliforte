import type { ReactNode } from "react";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f7f4ee] text-slate-900">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(239,55,45,0.12),transparent_24%),radial-gradient(circle_at_82%_10%,rgba(15,23,42,0.06),transparent_18%),linear-gradient(180deg,#fffdfa_0%,#f7f4ee_48%,#f2ede5_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:92px_92px] opacity-25" />
      <Header />
      <main className="relative z-10 flex-1">{children}</main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
