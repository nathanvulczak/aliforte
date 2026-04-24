import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminLeadUpdateSchema } from "@/lib/validators";

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

export async function PATCH(request: Request) {
  const auth = await requireAuthenticatedAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = adminLeadUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("company_leads")
    .update({
      status: parsed.data.status,
      priority: parsed.data.priority,
      notes: parsed.data.notes || null,
    })
    .eq("id", parsed.data.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
