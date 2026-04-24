import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminApplicationUpdateSchema } from "@/lib/validators";

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
  const parsed = adminApplicationUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("job_applications")
    .update({
      status: parsed.data.status,
      notes: parsed.data.notes || null,
      is_favorite: parsed.data.isFavorite,
    })
    .eq("id", parsed.data.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
