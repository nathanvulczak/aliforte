import { NextResponse } from "next/server";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { companyLeadSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = companyLeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json(
      {
        message:
          "Integração pendente: adicione as chaves do Supabase para armazenar os contatos no painel.",
      },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("company_leads").insert({
    company_name: parsed.data.companyName,
    contact_name: parsed.data.contactName,
    cnpj: parsed.data.cnpj,
    city: parsed.data.city,
    phone: parsed.data.phone,
    email: parsed.data.email,
    message: parsed.data.message || null,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
