"use client";

import { useState } from "react";

import { formatCnpj, formatPhoneBR, onlyDigits } from "@/lib/formatters";
import { companyLeadSchema } from "@/lib/validators";

const initialState = {
  companyName: "",
  contactName: "",
  cnpj: "",
  city: "",
  phone: "",
  email: "",
  message: "",
};

type FormState = typeof initialState;

export function CompanyLeadForm({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [form, setForm] = useState<FormState>(initialState);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    if (field === "cnpj") {
      value = formatCnpj(value);
    }

    if (field === "phone") {
      value = formatPhoneBR(value);
    }

    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const parsed = companyLeadSchema.safeParse({
      ...form,
      cnpj: onlyDigits(form.cnpj),
      phone: onlyDigits(form.phone),
    });

    if (!parsed.success) {
      setFeedback(parsed.error.issues[0]?.message ?? "Revise os dados do formulario.");
      return;
    }

    try {
      setSending(true);

      const response = await fetch("/api/company-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Nao foi possivel enviar o cadastro.");
      }

      setFeedback(
        "Cadastro enviado com sucesso. Sua solicitacao ja esta pronta para o painel comercial.",
      );
      setForm(initialState);
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Nao foi possivel enviar o cadastro.",
      );
    } finally {
      setSending(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white";

  return (
    <form
      onSubmit={handleSubmit}
      className="warm-surface space-y-4 rounded-[2rem] border border-slate-200 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] xl:p-6"
    >
      <div className={`grid gap-4 ${compact ? "md:grid-cols-2" : "md:grid-cols-2"}`}>
        <div className={compact ? "md:col-span-2" : ""}>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Nome da empresa
          </label>
          <input
            className={inputClass}
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
            placeholder="Ex.: Rede Agro Centro"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Responsavel
          </label>
          <input
            className={inputClass}
            value={form.contactName}
            onChange={(event) => updateField("contactName", event.target.value)}
            placeholder="Nome do contato"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">CNPJ</label>
          <input
            className={inputClass}
            value={form.cnpj}
            onChange={(event) => updateField("cnpj", event.target.value)}
            placeholder="00.000.000/0000-00"
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Cidade</label>
          <input
            className={inputClass}
            value={form.city}
            onChange={(event) => updateField("city", event.target.value)}
            placeholder="Cidade / UF"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Telefone</label>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="(00) 00000-0000"
            inputMode="tel"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            E-mail corporativo
          </label>
          <input
            className={inputClass}
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="empresa@dominio.com"
            type="email"
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Mensagem complementar
        </label>
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Conte um pouco sobre o perfil da empresa e o interesse comercial."
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-xs leading-6 text-slate-500">
          Os dados enviados entram no painel interno da Aliforte para retorno
          comercial e organizacao de leads.
        </p>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? "Enviando..." : "Solicitar contato"}
        </button>
      </div>
      {feedback ? (
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
