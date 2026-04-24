"use client";

import { useMemo, useState } from "react";

import { formatPhoneBR, onlyDigits } from "@/lib/formatters";
import type { SiteJob } from "@/lib/types";
import { jobApplicationSchema } from "@/lib/validators";

export function JobApplicationForm({
  jobs,
}: {
  jobs: SiteJob[];
}) {
  const [form, setForm] = useState({
    jobId: jobs[0]?.id ?? "",
    fullName: "",
    email: "",
    phone: "",
    city: "",
    linkedin: "",
    message: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const publishedJobs = useMemo(
    () => jobs.filter((job) => job.status === "published"),
    [jobs],
  );

  function updateField(field: keyof typeof form, value: string) {
    if (field === "phone") {
      value = formatPhoneBR(value);
    }

    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const parsed = jobApplicationSchema.safeParse({
      ...form,
      phone: onlyDigits(form.phone),
    });

    if (!parsed.success) {
      setFeedback(parsed.error.issues[0]?.message ?? "Revise os dados do formulario.");
      return;
    }

    if (!resumeFile) {
      setFeedback("Anexe um curriculo em PDF.");
      return;
    }

    if (resumeFile.type !== "application/pdf") {
      setFeedback("O curriculo precisa estar em PDF.");
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      setFeedback("O curriculo deve ter no maximo 5 MB.");
      return;
    }

    try {
      setSending(true);

      const body = new FormData();
      Object.entries(parsed.data).forEach(([key, value]) => body.append(key, value));
      body.append("resume", resumeFile);

      const response = await fetch("/api/job-applications", {
        method: "POST",
        body,
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Nao foi possivel enviar sua candidatura.");
      }

      setFeedback(
        "Curriculo enviado com sucesso. A equipe podera consultar seu cadastro pelo painel interno.",
      );
      setForm({
        jobId: publishedJobs[0]?.id ?? "",
        fullName: "",
        email: "",
        phone: "",
        city: "",
        linkedin: "",
        message: "",
      });
      setResumeFile(null);
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Nao foi possivel enviar sua candidatura.",
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Vaga desejada
          </label>
          <select
            className={inputClass}
            value={form.jobId}
            onChange={(event) => updateField("jobId", event.target.value)}
          >
            {publishedJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Nome completo
          </label>
          <input
            className={inputClass}
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
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
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Telefone
          </label>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="(00) 00000-0000"
            inputMode="tel"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">E-mail</label>
          <input
            className={inputClass}
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            type="email"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            LinkedIn ou portfolio
          </label>
          <input
            className={inputClass}
            value={form.linkedin}
            onChange={(event) => updateField("linkedin", event.target.value)}
            placeholder="https://www.linkedin.com/in/seu-perfil"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Curriculo em PDF
          </label>
          <input
            className={`${inputClass} cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white`}
            type="file"
            accept="application/pdf"
            onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Apresentacao profissional
        </label>
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Conte sua experiencia, objetivos e disponibilidade."
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-xs leading-6 text-slate-500">
          O curriculo sera salvo para consulta exclusiva da equipe
          administrativa da Aliforte.
        </p>
        <button
          type="submit"
          disabled={sending || publishedJobs.length === 0}
          className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? "Enviando..." : "Enviar curriculo"}
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
