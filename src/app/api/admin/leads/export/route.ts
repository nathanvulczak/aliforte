import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase nao configurado." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Acesso nao autorizado." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("company_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const rows = [
    ["empresa", "responsavel", "cnpj", "cidade", "telefone", "email", "status", "prioridade", "observacoes"],
    ...(data ?? []).map((lead) => [
      lead.company_name,
      lead.contact_name,
      lead.cnpj,
      lead.city,
      lead.phone,
      lead.email,
      lead.status,
      lead.priority ?? "media",
      lead.notes ?? "",
    ]),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leads-aliforte.csv"',
    },
  });
}
