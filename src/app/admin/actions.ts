"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminJobSchema, adminLoginSchema, buildJobPayload } from "@/lib/validators";

function redirectWithMessage(
  message: string,
  type: "error" | "success",
): never {
  redirect(`/admin?${type}=${encodeURIComponent(message)}`);
}

export async function loginAdminAction(formData: FormData) {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirectWithMessage(parsed.error.issues[0]?.message ?? "Credenciais inválidas.", "error");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirectWithMessage("Configure o Supabase antes de ativar o login administrativo.", "error");
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirectWithMessage(error.message, "error");
  }

  redirectWithMessage("Login realizado com sucesso.", "success");
}

export async function logoutAdminAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}

export async function saveJobAction(formData: FormData) {
  const parsed = adminJobSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    department: formData.get("department"),
    location: formData.get("location"),
    workModel: formData.get("workModel"),
    contractType: formData.get("contractType"),
    summary: formData.get("summary"),
    responsibilities: formData.get("responsibilities"),
    requirements: formData.get("requirements"),
    benefits: formData.get("benefits"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirectWithMessage(parsed.error.issues[0]?.message ?? "Revise os dados da vaga.", "error");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirectWithMessage("Configure o Supabase para salvar vagas pelo painel.", "error");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithMessage("Faça login para editar as vagas.", "error");
  }

  const payload = buildJobPayload(parsed.data);

  const { error } = await supabase.from("jobs").upsert(payload).select("id").single();

  if (error) {
    redirectWithMessage(error.message, "error");
  }

  redirectWithMessage("Vaga salva com sucesso.", "success");
}
