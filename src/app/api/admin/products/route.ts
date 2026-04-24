import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  adminProductCategorySchema,
  adminProductSchema,
  buildProductCategoryPayload,
  buildProductPayload,
} from "@/lib/validators";

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

function refresh() {
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin");
}

const actionSchema = z.object({
  kind: z.enum(["category", "product"]),
});

export async function POST(request: Request) {
  const auth = await requireAuthenticatedAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const actionParsed = actionSchema.safeParse(body);

  if (!actionParsed.success) {
    return NextResponse.json({ message: "Tipo de cadastro invalido." }, { status: 400 });
  }

  if (actionParsed.data.kind === "category") {
    const parsed = adminProductCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message }, { status: 400 });
    }
    const { error } = await auth.supabase
      .from("product_categories")
      .insert(buildProductCategoryPayload({ ...parsed.data, id: "" }));

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    refresh();
    return NextResponse.json({ ok: true });
  }

  const parsed = adminProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("products")
    .insert(buildProductPayload({ ...parsed.data, id: "" }));

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  refresh();
  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const auth = await requireAuthenticatedAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const actionParsed = actionSchema.safeParse(body);

  if (!actionParsed.success) {
    return NextResponse.json({ message: "Tipo de cadastro invalido." }, { status: 400 });
  }

  if (actionParsed.data.kind === "category") {
    const parsed = adminProductCategorySchema.safeParse(body);
    if (!parsed.success || !parsed.data.id) {
      return NextResponse.json({ message: "Categoria invalida." }, { status: 400 });
    }
    const { error } = await auth.supabase
      .from("product_categories")
      .upsert(buildProductCategoryPayload(parsed.data));

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    refresh();
    return NextResponse.json({ ok: true });
  }

  const parsed = adminProductSchema.safeParse(body);
  if (!parsed.success || !parsed.data.id) {
    return NextResponse.json({ message: "Produto invalido." }, { status: 400 });
  }

  const { error } = await auth.supabase.from("products").upsert(buildProductPayload(parsed.data));

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  refresh();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const auth = await requireAuthenticatedAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = z
    .object({
      kind: z.enum(["category", "product"]),
      id: z.string().uuid(),
    })
    .safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Registro invalido." }, { status: 400 });
  }

  const table = parsed.data.kind === "category" ? "product_categories" : "products";
  const { error } = await auth.supabase.from(table).delete().eq("id", parsed.data.id);

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  refresh();
  return NextResponse.json({ ok: true });
}
