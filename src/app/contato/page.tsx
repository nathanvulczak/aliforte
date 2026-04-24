import type { Metadata } from "next";
import { Building2, Mail, MapPinned, PhoneCall } from "lucide-react";

import { CompanyLeadForm } from "@/components/forms/company-lead-form";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteShell } from "@/components/site/site-shell";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contato Comercial",
  description:
    "Solicite contato da equipe comercial da Aliforte ou cadastre sua empresa para atendimento.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-7xl px-4 pb-18 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Contato Comercial"
              title="Cadastre sua empresa para atendimento da Aliforte"
              description="Faça seu cadastro para receber nosso contato, e começarmos uma parceria sólida e duradoura."
            />
            <div className="grid gap-4">
              <div className="soft-card rounded-[1.75rem] p-5">
                <Building2 className="h-5 w-5 text-brand-500" />
                <p className="mt-4 text-lg font-semibold text-slate-900">{company.name}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{company.tagline}</p>
              </div>
              <a
                href={`tel:+55${company.phoneRaw}`}
                className="soft-card rounded-[1.75rem] p-5 hover:border-brand-300"
              >
                <PhoneCall className="h-5 w-5 text-brand-500" />
                <p className="mt-4 text-lg font-semibold text-slate-900">{company.phoneDisplay}</p>
                <p className="mt-2 text-sm text-slate-600">Telefone comercial</p>
              </a>
              <a
                href={`mailto:${company.email}`}
                className="soft-card rounded-[1.75rem] p-5 hover:border-brand-300"
              >
                <Mail className="h-5 w-5 text-brand-500" />
                <p className="mt-4 text-lg font-semibold text-slate-900">{company.email}</p>
                <p className="mt-2 text-sm text-slate-600">E-mail institucional</p>
              </a>
              <a
                href={company.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="soft-card rounded-[1.75rem] p-5 hover:border-brand-300"
              >
                <MapPinned className="h-5 w-5 text-brand-500" />
                <p className="mt-4 text-lg font-semibold text-slate-900">{company.city}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{company.address}</p>
              </a>
            </div>
          </div>
          <CompanyLeadForm />
        </div>
      </section>
    </SiteShell>
  );
}
