export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatPhoneBR(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatCnpj(value: string) {
  const digits = onlyDigits(value).slice(0, 14);

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
      5,
      8,
    )}/${digits.slice(8)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
    5,
    8,
  )}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDatePtBR(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export function statusLabel(value: string) {
  const labels: Record<string, string> = {
    draft: "Rascunho",
    published: "Publicada",
    closed: "Encerrada",
    novo: "Novo",
    em_contato: "Em contato",
    qualificado: "Qualificado",
    proposta: "Proposta",
    encerrado: "Encerrado",
    triagem: "Triagem",
    entrevista: "Entrevista",
    aprovado: "Aprovado",
    baixa: "Baixa",
    media: "Media",
    alta: "Alta",
  };

  return labels[value] ?? value;
}

export function parseSimpleLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function stringifySimpleLines(value: string[]) {
  return value.join("\n");
}

export function parseTitledBodyLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...bodyParts] = line.split("|");
      return {
        title: title?.trim() ?? "",
        body: bodyParts.join("|").trim(),
      };
    })
    .filter((item) => item.title && item.body);
}

export function stringifyTitledBodyLines(
  value: Array<{ title: string; body: string }>,
) {
  return value.map((item) => `${item.title} | ${item.body}`).join("\n");
}
