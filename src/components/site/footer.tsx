"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";

import { company, navigation } from "@/lib/company";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return (
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.08em] text-slate-900">
              Painel Interno Aliforte
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Ambiente administrativo para vagas, curriculos e contatos comerciais.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-600 lg:items-end">
            <p className="font-medium text-slate-900">{company.name}</p>
            <p>{company.city}</p>
            <Link href="/" className="font-semibold text-brand-600 hover:text-brand-500">
              Voltar para o site
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-200 bg-slate-950">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-slate-200 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p className="font-medium text-white">{company.name} - Area administrativa</p>
            <p className="text-slate-400">Uso interno</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.95fr_0.9fr] lg:px-8">
        <div className="space-y-5">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.1em] text-slate-900">
              {company.name}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Presenca digital criada para divulgar a empresa, mostrar o que vende e
              para quem atende, com uma linguagem comercial mais clara e profissional.
            </p>
          </div>
          <div className="grid gap-3">
            <a
              href={`tel:+55${company.phoneRaw}`}
              className="inline-flex items-center gap-3 text-sm text-slate-700 hover:text-brand-600"
            >
              <Phone className="h-4 w-4 text-brand-500" />
              {company.phoneDisplay}
            </a>
            <a
              href={`mailto:${company.email}`}
              className="inline-flex items-center gap-3 text-sm text-slate-700 hover:text-brand-600"
            >
              <Mail className="h-4 w-4 text-brand-500" />
              {company.email}
            </a>
            <a
              href={company.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-start gap-3 text-sm leading-6 text-slate-700 hover:text-brand-600"
            >
              <MapPin className="mt-1 h-4 w-4 text-brand-500" />
              {company.address}
            </a>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <iframe
            title="Mapa da Aliforte"
            src={company.mapEmbedUrl}
            loading="lazy"
            className="h-72 w-full rounded-[1.35rem] border-0"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">
              Links diretos
            </p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-brand-600">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-brand-100 bg-brand-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">
              Atendimento comercial
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Entre em contato para conhecer a operacao, solicitar retorno comercial
              ou apresentar sua empresa.
            </p>
            <Link
              href="/contato"
              className="mt-5 inline-flex rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400"
            >
              Solicitar contato
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-200 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="font-medium text-white">{company.name} - Distribuidora de racoes</p>
          <div className="flex flex-col gap-1 lg:items-end">
            <p>{company.city}</p>
            <p className="text-slate-400">Atendimento comercial e institucional</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
