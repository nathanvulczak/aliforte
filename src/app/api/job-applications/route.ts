import { NextResponse } from "next/server";

import { slugify } from "@/lib/formatters";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { jobApplicationSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const formData = await request.formData();
  const resume = formData.get("resume");

  const parsed = jobApplicationSchema.safeParse({
    jobId: formData.get("jobId"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    linkedin: formData.get("linkedin"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  if (!(resume instanceof File)) {
    return NextResponse.json({ message: "Anexe um currículo em PDF." }, { status: 400 });
  }

  if (resume.type !== "application/pdf") {
    return NextResponse.json(
      { message: "O currículo precisa estar em PDF." },
      { status: 400 },
    );
  }

  if (resume.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { message: "O currículo deve ter no máximo 5 MB." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json(
      {
        message:
          "Integração pendente: conecte o Supabase para armazenar currículos e candidaturas.",
      },
      { status: 503 },
    );
  }

  const filePath = `${parsed.data.jobId}/${Date.now()}-${slugify(parsed.data.fullName)}.pdf`;
  const arrayBuffer = await resume.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, arrayBuffer, {
      cacheControl: "3600",
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ message: uploadError.message }, { status: 500 });
  }

  const { error } = await supabase.from("job_applications").insert({
    job_id: parsed.data.jobId,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    city: parsed.data.city,
    linkedin: parsed.data.linkedin || null,
    message: parsed.data.message || null,
    resume_path: filePath,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
