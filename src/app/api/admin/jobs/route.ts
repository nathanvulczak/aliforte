import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminJobSchema, buildJobPayload } from "@/lib/validators";

async function requireAuthenticatedAdmin() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      error: NextResponse.json({ message: "Supabase nao configurado." }, { status: 503 }),
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ message: "Acesso nao autorizado." }, { status: 401 }),
    };
  }

  return { supabase };
}

function refreshAdminPaths() {
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/trabalhe-conosco");
  revalidatePath("/admin");
}

const duplicateJobSchema = z.object({
  action: z.literal("duplicate"),
  id: z.string().uuid(),
});

export async function POST(request: Request) {
  const auth = await requireAuthenticatedAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();

  const duplicateParsed = duplicateJobSchema.safeParse(body);
  if (duplicateParsed.success) {
    const { data: existingJob, error: existingError } = await auth.supabase
      .from("jobs")
      .select("*")
      .eq("id", duplicateParsed.data.id)
      .single();

    if (existingError || !existingJob) {
      return NextResponse.json({ message: "Nao foi possivel localizar a vaga." }, { status: 404 });
    }

    const payload = {
      ...existingJob,
      id: undefined,
      title: `${existingJob.title} - copia`,
      slug: `${existingJob.slug}-${Date.now()}`,
      status: "draft",
      published_at: null,
      closed_at: null,
      publish_at: null,
      close_at: null,
      featured_home: false,
    };

    const { data, error } = await auth.supabase.from("jobs").insert(payload).select("*").single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    refreshAdminPaths();
    return NextResponse.json({ ok: true, job: data });
  }

  const parsed = adminJobSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Dados invalidos." },
      { status: 400 },
    );
  }

  const payload = buildJobPayload({ ...parsed.data, id: "" });
  const { data, error } = await auth.supabase.from("jobs").insert(payload).select("*").single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  refreshAdminPaths();
  return NextResponse.json({ ok: true, job: data });
}

export async function PUT(request: Request) {
  const auth = await requireAuthenticatedAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = adminJobSchema.safeParse(body);

  if (!parsed.success || !parsed.data.id) {
    return NextResponse.json({ message: "Informe uma vaga valida." }, { status: 400 });
  }

  const payload = buildJobPayload(parsed.data);
  const { data, error } = await auth.supabase.from("jobs").upsert(payload).select("*").single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  refreshAdminPaths();
  return NextResponse.json({ ok: true, job: data });
}

export async function DELETE(request: Request) {
  const auth = await requireAuthenticatedAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = z.object({ id: z.string().uuid() }).safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Vaga invalida." }, { status: 400 });
  }

  const { error } = await auth.supabase.from("jobs").delete().eq("id", parsed.data.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  refreshAdminPaths();
  return NextResponse.json({ ok: true });
}
