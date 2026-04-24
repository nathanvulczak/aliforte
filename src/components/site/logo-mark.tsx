import Image from "next/image";
import Link from "next/link";

export function LogoMark({
  href = "/",
  compact = false,
}: {
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <span
        className={`rounded-2xl border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.10)] transition-all duration-300 ${
          compact ? "px-2 py-1.5" : "px-3 py-2"
        }`}
      >
        <Image
          src="/logo.png"
          alt="Logo da Aliforte"
          width={compact ? 62 : 104}
          height={compact ? 31 : 52}
          priority
        />
      </span>
      <span
        className={`hidden transition-all duration-300 md:block ${
          compact ? "translate-y-0.5 opacity-90" : ""
        }`}
      >
        <span
          className={`block font-display font-semibold uppercase tracking-[0.12em] text-slate-900 transition-all duration-300 ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          Aliforte
        </span>
        <span className="block text-xs uppercase tracking-[0.24em] text-slate-500">
          Distribuidora
        </span>
      </span>
    </Link>
  );
}
