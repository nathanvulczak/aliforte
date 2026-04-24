"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LogoMark } from "@/components/site/logo-mark";
import { company, navigation } from "@/lib/company";

export function Header() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setCompact(window.scrollY > 32);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <div
        className={`transition-all duration-300 ${
          compact ? "h-[106px] lg:h-[88px]" : "h-[122px] lg:h-[94px]"
        }`}
      />
      <header
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${
          compact
            ? "bg-transparent pt-2 lg:pt-3"
            : "border-b border-slate-200/80 bg-white/94 backdrop-blur-xl"
        }`}
      >
        <div
          className={`mx-auto flex w-full items-center justify-between gap-4 transition-all duration-300 ${
            compact
              ? "max-w-6xl rounded-[1.65rem] border border-slate-200/90 bg-white/92 px-4 py-2.5 shadow-[0_18px_42px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:px-6"
              : "max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
          }`}
        >
          <LogoMark compact={compact} />
          <nav className="hidden items-center gap-6 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium text-slate-600 transition hover:text-brand-600 ${
                  compact ? "text-[13px]" : "text-sm"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/55${company.phoneRaw}`}
              target="_blank"
              rel="noreferrer"
              className={`hidden rounded-full border border-slate-200 font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600 sm:inline-flex ${
                compact ? "px-3.5 py-2 text-[13px]" : "px-4 py-2 text-sm"
              }`}
            >
              WhatsApp
            </a>
            <Link
              href="/contato"
              className={`rounded-full bg-brand-500 font-semibold text-white shadow-[0_12px_26px_rgba(239,55,45,0.24)] transition hover:bg-brand-400 ${
                compact ? "px-3.5 py-2 text-[13px]" : "px-4 py-2 text-sm"
              }`}
            >
              Cadastrar Empresa
            </Link>
          </div>
        </div>
        <div
          className={`scrollbar-none overflow-x-auto transition-all duration-300 lg:hidden ${
            compact
              ? "mx-auto mt-2 max-w-6xl rounded-[1.35rem] border border-slate-200 bg-white/92 px-4 py-2 shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
              : "border-t border-slate-100 px-4 py-3"
          }`}
        >
          <div className="mx-auto flex w-max min-w-full gap-5 text-sm text-slate-600">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap transition hover:text-brand-600"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
