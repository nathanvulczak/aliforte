import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CircleCheckBig,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { CompanyLeadForm } from "@/components/forms/company-lead-form";
import { ProductsShowcase } from "@/components/products/products-showcase";
import { CountUpStat } from "@/components/site/count-up-stat";
import { RevealSection } from "@/components/site/reveal-section";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteShell } from "@/components/site/site-shell";
import { company } from "@/lib/company";
import { getHomePageData } from "@/lib/data";

const sectionIcons = [Building2, Truck, ShieldCheck];
const audienceIcons = [Building2, Route, BadgeCheck];

export default async function HomePage() {
  const { settings, categories, products, featuredProducts, jobs } = await getHomePageData();
  const sectionOrder =
    settings.homeSectionOrder.length > 0
      ? settings.homeSectionOrder
      : [
          { id: "credibilidade", label: "Credibilidade" },
          { id: "produtos", label: "Produtos" },
          { id: "atendimento", label: "Atendimento" },
          { id: "publico", label: "Publico" },
          { id: "compromisso", label: "Compromisso" },
          { id: "contato", label: "Contato" },
          { id: "talentos", label: "Talentos" },
        ];

  return (
    <SiteShell>
      <RevealSection className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-18 pt-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-24 lg:pt-16">
        <div className="space-y-8">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">
            {settings.heroBadge}
          </span>

          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              {settings.heroEyebrow}
            </p>
            <h1 className="max-w-5xl font-display text-[clamp(2.8rem,6vw,5.8rem)] font-semibold uppercase leading-[0.92] tracking-[0.03em] text-slate-950">
              {settings.heroTitle}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              {settings.heroDescription}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href={settings.heroPrimaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_50px_rgba(239,55,45,0.24)] hover:bg-brand-400"
            >
              {settings.heroPrimaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={settings.heroSecondaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.05)] hover:border-brand-300 hover:text-brand-600"
            >
              {settings.heroSecondaryLabel}
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {settings.heroStats.map((metric) => (
              <CountUpStat key={`${metric.value}-${metric.label}`} value={metric.value} label={metric.label} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="soft-card overflow-hidden rounded-[2.3rem] p-3">
            <div className="relative overflow-hidden rounded-[1.75rem]">
              <Image
                src={
                  typeof settings.heroImageUrl === "string" && settings.heroImageUrl
                    ? settings.heroImageUrl
                    : "/images/fallback.jpg"
                }
                alt={settings.heroImageAlt || "Imagem"}
                width={1400}
                height={960}
                className="h-[420px] w-full object-cover"
                priority
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,15,23,0.04),rgba(11,15,23,0.55))]" />

              <div className="absolute bottom-0 left-0 right-0 grid gap-4 p-6 text-white sm:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-brand-100">
                    Estrutura e distribuicao
                  </p>
                  <p className="mt-3 max-w-md text-2xl font-semibold leading-tight">
                    A ALIFORTE conta com centro de distribuição próprio, garantindo agilidade nas entregas.
                  </p>
                </div>

                <div className="rounded-[1.4rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.22em] text-brand-100">
                    Características
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-100">
                    {settings.trustSignals.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CircleCheckBig className="mt-1 h-4 w-4 text-brand-200" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="soft-card rounded-[1.9rem] px-5 py-6">
              <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Quem é a empresa</p>
              <p className="mt-4 text-base leading-8 text-slate-700">
                A Aliforte foi fundada em {company.foundedYear} e hoje representa uma forte presença
                na distribuição na região de Guarapuava.
              </p>
            </div>
            <div className="soft-card rounded-[1.9rem] px-5 py-6">
              <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Por que comprar</p>
              <p className="mt-4 text-base leading-8 text-slate-700">
                Porque a proposta agora deixa claro o que a empresa vende, para quem
                vende e como o atendimento foi pensado para outras empresas da regiao.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {sectionOrder.map((section, index) => {
        const delay = 70 + index * 35;

        if (section.id === "credibilidade") {
          return (
            <RevealSection
              key={section.id}
              id="empresa"
              delay={delay}
              className="section-emerge mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
            >
              <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
                <div className="soft-card rounded-[2.2rem] px-6 py-7">
                  <SectionHeading
                    eyebrow="Credibilidade"
                    title={settings.proofHeadline}
                    description={settings.proofDescription}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {settings.differentiators.map((item, cardIndex) => {
                    const Icon = sectionIcons[cardIndex % sectionIcons.length];
                    return (
                      <article
                        key={item.title}
                        className="soft-card group rounded-[1.9rem] px-6 py-6 transition hover:-translate-y-1"
                      >
                        <div className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-5 text-xl font-semibold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </RevealSection>
          );
        }

        if (section.id === "produtos") {
          return (
            <RevealSection
              key={section.id}
              id="produtos"
              delay={delay}
              className="section-emerge mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
            >
              <div className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
                  <div className="soft-card rounded-[2.2rem] px-6 py-7">
                    <SectionHeading
                      eyebrow="Produtos"
                      title={settings.productsHeadline}
                      description={settings.productsDescription}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {featuredProducts.map((product) => (
                      <div key={product.id} className="soft-card rounded-[1.7rem] px-5 py-6">
                        <p className="text-sm uppercase tracking-[0.22em] text-brand-700">
                          {product.categoryName}
                        </p>
                        <h3 className="mt-3 text-xl font-semibold text-slate-900">
                          {product.name}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {product.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <ProductsShowcase categories={categories} products={products} />
              </div>
            </RevealSection>
          );
        }

        if (section.id === "atendimento") {
          return (
            <RevealSection
              key={section.id}
              delay={delay}
              className="section-emerge mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
            >
              <div className="grid gap-8 lg:grid-cols-[0.52fr_0.48fr]">
                <div className="space-y-6">
                  <div className="soft-card rounded-[2.2rem] px-6 py-7">
                    <SectionHeading
                      eyebrow="Atendimento"
                      title={settings.serviceHeadline}
                      description={settings.serviceDescription}
                    />
                  </div>

                  <div className="grid gap-4">
                    {settings.serviceSteps.map((item, stepIndex) => (
                      <article
                        key={item.title}
                        className="soft-card relative overflow-hidden rounded-[1.8rem] px-6 py-6"
                      >
                        <span className="font-display text-4xl font-semibold uppercase tracking-[0.16em] text-brand-100">
                          0{stepIndex + 1}
                        </span>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="soft-card overflow-hidden rounded-[2.3rem] p-3">
                  <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#fff8f4,#f3ede6)] px-6 py-7">
                    <div className="absolute -right-8 top-0 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
                    <div className="relative z-10">
                      <p className="text-sm uppercase tracking-[0.24em] text-brand-700">
                        Marcas e linhas atendidas
                      </p>
                      <p className="mt-3 max-w-md text-lg leading-8 text-slate-700">
                        O painel agora pode destacar campanhas, linhas e categorias com muito
                        mais controle. Quando voce quiser, entramos com as marcas reais da
                        Aliforte aqui.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        {settings.featuredBrands.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          );
        }

        if (section.id === "publico") {
          return (
            <RevealSection
              key={section.id}
              id="quem-atendemos"
              delay={delay}
              className="section-emerge mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
            >
              <div className="grid gap-8 lg:grid-cols-[0.46fr_0.54fr]">
                <div className="soft-card rounded-[2.2rem] px-6 py-7">
                  <SectionHeading
                    eyebrow="Publico Atendido"
                    title={settings.audienceHeadline}
                    description={settings.audienceDescription}
                  />
                  <div className="mt-8 rounded-[1.7rem] border border-brand-100 bg-brand-50 px-5 py-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-brand-700">
                      Compromisso
                    </p>
                    <p className="mt-3 text-base leading-8 text-slate-700">
                      {settings.commitmentDescription}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {settings.audienceItems.map((item, cardIndex) => {
                    const Icon = audienceIcons[cardIndex % audienceIcons.length];
                    return (
                      <article key={item.title} className="soft-card rounded-[1.9rem] px-6 py-6">
                        <div className="inline-flex rounded-2xl bg-slate-900 p-3 text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-5 text-xl font-semibold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </RevealSection>
          );
        }

        if (section.id === "compromisso") {
          return (
            <RevealSection
              key={section.id}
              delay={delay}
              className="section-emerge mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
            >
              <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
                <div className="soft-card rounded-[2.2rem] px-6 py-7">
                  <SectionHeading
                    eyebrow="Parceria"
                    title={settings.commitmentHeadline}
                    description={settings.commitmentDescription}
                  />
                </div>
                <div className="grid gap-3">
                  {settings.commitmentItems.map((item) => (
                    <div
                      key={item}
                      className="soft-card flex items-start gap-3 rounded-[1.45rem] px-5 py-4"
                    >
                      <CircleCheckBig className="mt-1 h-5 w-5 text-brand-500" />
                      <p className="text-sm leading-7 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          );
        }

        if (section.id === "contato") {
          return (
            <RevealSection
              key={section.id}
              delay={delay}
              className="section-emerge mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
            >
              <div className="warm-surface rounded-[2.4rem] border border-slate-200 px-5 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-6">
                <SectionHeading
                  eyebrow="Contato Comercial"
                  title={settings.contactHeadline}
                  description={settings.contactDescription}
                />
                <div className="mt-7">
                  <CompanyLeadForm compact />
                </div>
              </div>
            </RevealSection>
          );
        }

        if (section.id === "talentos") {
          return (
            <RevealSection
              key={section.id}
              delay={delay}
              className="section-emerge mx-auto w-full max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8"
            >
              <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
                <div className="soft-card rounded-[2.2rem] px-6 py-7">
                  <SectionHeading
                    eyebrow="Talentos"
                    title={settings.careersHeadline}
                    description={settings.careersDescription}
                  />
                  <Link
                    href="/trabalhe-conosco"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Acessar portal de vagas
                    <BriefcaseBusiness className="h-4 w-4 text-brand-300" />
                  </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {jobs.slice(0, 2).map((job) => (
                    <article key={job.id} className="soft-card rounded-[1.9rem] px-6 py-6">
                      <p className="text-sm uppercase tracking-[0.22em] text-brand-700">
                        {job.department}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                        {job.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{job.summary}</p>
                    </article>
                  ))}
                </div>
              </div>
            </RevealSection>
          );
        }

        return null;
      })}
    </SiteShell>
  );
}
