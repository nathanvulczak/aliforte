import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole, Logs, Mail, UsersRound } from "lucide-react";

import { loginAdminAction, logoutAdminAction } from "@/app/admin/actions";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteShell } from "@/components/site/site-shell";
import { getAdminDashboardData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Painel Administrativo",
  description:
    "Area administrativa da Aliforte para login interno, conteudo do site, produtos, vagas, curriculos e contatos comerciais.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getMessage(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const errorMessage = getMessage(params.error);
  const successMessage = getMessage(params.success);
  const dashboard = await getAdminDashboardData();

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-7xl px-4 pb-18 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Painel Administrativo"
            title="Conteudo, produtos, leads, curriculos e vagas em um painel unico"
            description="O ambiente interno foi ampliado para dar mais autonomia comercial e editorial, sem perder clareza no uso diario."
          />

          {!dashboard.isSupabaseConfigured ? (
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="soft-card rounded-[2rem] p-7">
                <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.08em] text-slate-900">
                  Integracao pendente
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  O layout do painel esta pronto. Para ativar dados reais, login
                  interno, upload de imagens, curriculos e o CMS do site, basta
                  preencher as variaveis do Supabase e rodar o SQL entregue no projeto.
                </p>
                <div className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
                  <p>`NEXT_PUBLIC_SUPABASE_URL`</p>
                  <p>`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`</p>
                  <p>`SUPABASE_SERVICE_ROLE_KEY`</p>
                  <p>Depois crie o usuario administrador pelo Auth do Supabase.</p>
                </div>
                <Link
                  href="/trabalhe-conosco"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600"
                >
                  Ver portal de vagas
                  <Logs className="h-4 w-4 text-brand-500" />
                </Link>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="soft-card rounded-[1.75rem] p-5">
                    <UsersRound className="h-5 w-5 text-brand-500" />
                    <p className="mt-4 text-2xl font-semibold text-slate-900">
                      {dashboard.leads.length}
                    </p>
                    <p className="text-sm text-slate-600">Leads demonstrativos</p>
                  </div>
                  <div className="soft-card rounded-[1.75rem] p-5">
                    <Mail className="h-5 w-5 text-brand-500" />
                    <p className="mt-4 text-2xl font-semibold text-slate-900">
                      {dashboard.applications.length}
                    </p>
                  <p className="text-sm text-slate-600">Curriculos demonstrativos</p>
                </div>
                <div className="soft-card rounded-[1.75rem] p-5">
                  <LockKeyhole className="h-5 w-5 text-brand-500" />
                    <p className="mt-4 text-2xl font-semibold text-slate-900">
                      {dashboard.jobs.length}
                    </p>
                    <p className="text-sm text-slate-600">Vagas demonstrativas</p>
                  </div>
                </div>
                <div className="soft-card rounded-[2rem] p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-brand-700">
                    Previa do sistema
                  </p>
                  <p className="mt-4 text-base leading-8 text-slate-700">
                    Mesmo sem o Supabase conectado, o painel ja mostra como vai
                    funcionar a edicao da home, a gestao de produtos, a consulta de
                    contatos, candidaturas e vagas assim que as chaves forem inseridas.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {dashboard.isSupabaseConfigured && !dashboard.userEmail ? (
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <form action={loginAdminAction} className="warm-surface rounded-[2rem] border border-slate-200 p-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.08em] text-slate-900">
                  Login interno
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Use o e-mail administrativo criado no Supabase Auth para acessar a
                  gestao de conteudo, produtos, vagas, curriculos e contatos.
                </p>
                <div className="mt-8 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">E-mail</label>
                    <input
                      name="email"
                      type="email"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-400"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Senha</label>
                    <input
                      name="password"
                      type="password"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-400"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-400"
                >
                  Entrar no painel
                </button>
              </form>

              <div className="soft-card rounded-[2rem] p-7">
                <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.08em] text-slate-900">
                  O que o admin controla aqui
                </h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "Editar hero, secoes, diferenciais e ritmo da home",
                    "Cadastrar categorias, produtos e destaques",
                    "Consultar curriculos e contatos comerciais com filtros",
                    "Abrir, duplicar, ordenar e agendar vagas",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {dashboard.userEmail ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-[2rem] border border-brand-100 bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Sessao ativa</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{dashboard.userEmail}</p>
                </div>
                <form action={logoutAdminAction}>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600"
                  >
                    Sair
                  </button>
                </form>
              </div>

              <AdminDashboard
                dashboard={dashboard}
                errorMessage={errorMessage}
                successMessage={successMessage}
              />
            </div>
          ) : null}

          {!dashboard.userEmail && errorMessage ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
          {!dashboard.userEmail && successMessage ? (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </p>
          ) : null}
        </div>
      </section>
    </SiteShell>
  );
}
