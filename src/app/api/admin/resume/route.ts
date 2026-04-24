import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ message: "Arquivo não informado." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const service = createSupabaseServiceClient();

  if (!supabase || !service) {
    return NextResponse.json(
      { message: "Integração com Supabase não configurada." },
      { status: 503 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  }

  const { data, error } = await service.storage
    .from("resumes")
    .createSignedUrl(path, 60);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { message: error?.message ?? "Não foi possível gerar o link." },
      { status: 500 },
    );
  }

  return NextResponse.redirect(data.signedUrl);
}
