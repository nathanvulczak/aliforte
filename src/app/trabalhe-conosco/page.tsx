import type { Metadata } from "next";
import { BriefcaseBusiness, Clock3, MapPin, Network } from "lucide-react";

import { JobApplicationForm } from "@/components/forms/job-application-form";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteShell } from "@/components/site/site-shell";
import { getPublicJobs } from "@/lib/data";
import { formatDatePtBR } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Trabalhe Conosco",
  description:
    "Veja as vagas abertas da Aliforte e cadastre seu curriculo em PDF para analise da equipe interna.",
};

export default async function CareersPage() {
  const jobs = await getPublicJobs();

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-7xl px-4 pb-18 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Trabalhe Conosco"
            title="Vagas abertas com candidatura digital e curriculo em PDF"
            description="Uma experiencia simples para candidatos e muito mais organizada para o time interno da Aliforte."
          />
          <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr]">
            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <article key={job.id} className="soft-card rounded-[2rem] p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-brand-700">
                      <span className="rounded-full bg-brand-50 px-3 py-1">{job.department}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                        {job.contractType}
                      </span>
                    </div>
                    <h2 className="mt-5 text-2xl font-semibold text-slate-900">{job.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{job.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
                        <MapPin className="h-4 w-4 text-brand-500" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
                        <Network className="h-4 w-4 text-brand-500" />
                        {job.workModel}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
                        <Clock3 className="h-4 w-4 text-brand-500" />
                        Publicada em {formatDatePtBR(job.publishedAt ?? job.createdAt)}
                      </span>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                      <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">Responsabilidades</p>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                          {job.responsibilities.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">Requisitos</p>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                          {job.requirements.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">Beneficios</p>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                          {job.benefits.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="soft-card rounded-[2rem] p-6">
                  <BriefcaseBusiness className="h-6 w-6 text-brand-500" />
                  <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                    Nenhuma vaga publicada no momento
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    O painel administrativo ja esta preparado para abrir, editar e
                    encerrar vagas quando voce quiser.
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="soft-card rounded-[2rem] p-6">
                <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.08em] text-slate-900">
                  Envie seu curriculo
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Escolha a vaga, envie seu PDF e centralize sua candidatura no
                  banco de dados da empresa.
                </p>
              </div>
              <JobApplicationForm jobs={jobs} />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
