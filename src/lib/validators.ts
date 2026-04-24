import { z } from "zod";

import {
  onlyDigits,
  parseSimpleLines,
  parseTitledBodyLines,
  slugify,
} from "@/lib/formatters";

const requiredText = (label: string, min = 2) =>
  z
    .string()
    .trim()
    .min(min, `${label} precisa ter pelo menos ${min} caracteres.`);

export const companyLeadSchema = z.object({
  companyName: requiredText("Nome da empresa"),
  contactName: requiredText("Responsavel"),
  cnpj: z
    .string()
    .transform(onlyDigits)
    .refine((value) => value.length === 14, "Informe um CNPJ com 14 digitos."),
  city: requiredText("Cidade"),
  phone: z
    .string()
    .transform(onlyDigits)
    .refine(
      (value) => value.length === 10 || value.length === 11,
      "Informe um telefone com DDD valido.",
    ),
  email: z.string().trim().email("Informe um e-mail valido."),
  message: z
    .string()
    .trim()
    .max(1000, "A mensagem pode ter no maximo 1000 caracteres.")
    .optional()
    .or(z.literal("")),
});

export const jobApplicationSchema = z.object({
  jobId: z.string().uuid("Selecione uma vaga valida."),
  fullName: requiredText("Nome completo", 3),
  email: z.string().trim().email("Informe um e-mail valido."),
  phone: z
    .string()
    .transform(onlyDigits)
    .refine(
      (value) => value.length === 10 || value.length === 11,
      "Informe um telefone com DDD valido.",
    ),
  city: requiredText("Cidade"),
  linkedin: z
    .string()
    .trim()
    .url("Informe uma URL valida para LinkedIn ou portfolio.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(1200, "A apresentacao pode ter no maximo 1200 caracteres.")
    .optional()
    .or(z.literal("")),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail valido."),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const adminJobSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: requiredText("Titulo da vaga", 4),
  department: requiredText("Area"),
  location: requiredText("Local"),
  workModel: requiredText("Modelo"),
  contractType: requiredText("Tipo de contrato"),
  summary: requiredText("Resumo", 20),
  responsibilities: requiredText("Responsabilidades", 10),
  requirements: requiredText("Requisitos", 10),
  benefits: requiredText("Beneficios", 10),
  status: z.enum(["draft", "published", "closed"]),
  featuredHome: z.boolean().optional().default(false),
  displayOrder: z.coerce.number().min(0).default(0),
  publishAt: z.string().optional().nullable(),
  closeAt: z.string().optional().nullable(),
});

export const adminProductCategorySchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: requiredText("Categoria", 3),
  description: requiredText("Descricao", 8),
  displayOrder: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const adminProductSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  categoryId: z.string().uuid("Selecione uma categoria valida."),
  name: requiredText("Nome do produto", 3),
  summary: requiredText("Resumo", 12),
  description: requiredText("Descricao", 20),
  idealFor: requiredText("Perfil ideal", 8),
  applications: requiredText("Aplicacoes", 8),
  differentials: requiredText("Diferenciais", 8),
  imageUrl: z.string().trim().url("Informe uma URL valida.").optional().or(z.literal("")),
  imageAlt: z.string().trim().max(140).optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().min(0).default(0),
});

export const adminSiteSettingsSchema = z.object({
  heroBadge: requiredText("Selo", 2),
  heroTitle: requiredText("Titulo principal", 12),
  heroDescription: requiredText("Descricao principal", 20),
  heroPrimaryLabel: requiredText("CTA principal", 2),
  heroPrimaryHref: requiredText("Link principal", 1),
  heroSecondaryLabel: requiredText("CTA secundario", 2),
  heroSecondaryHref: requiredText("Link secundario", 1),
  heroImageUrl: z.string().trim().url("Informe uma URL valida para a imagem principal."),
  heroImageAlt: requiredText("Texto alternativo da imagem", 8),
  heroEyebrow: requiredText("Linha de apoio", 4),
  campaignLabel: requiredText("Label da campanha", 2),
  campaignTitle: requiredText("Titulo da campanha", 8),
  campaignDescription: requiredText("Descricao da campanha", 20),
  campaignHref: requiredText("Link da campanha", 1),
  campaignCtaLabel: requiredText("Texto do botao da campanha", 2),
  proofHeadline: requiredText("Titulo de credibilidade", 8),
  proofDescription: requiredText("Descricao de credibilidade", 20),
  productsHeadline: requiredText("Titulo de produtos", 8),
  productsDescription: requiredText("Descricao de produtos", 20),
  audienceHeadline: requiredText("Titulo de publico", 8),
  audienceDescription: requiredText("Descricao de publico", 20),
  serviceHeadline: requiredText("Titulo de atendimento", 8),
  serviceDescription: requiredText("Descricao de atendimento", 20),
  commitmentHeadline: requiredText("Titulo de compromisso", 8),
  commitmentDescription: requiredText("Descricao de compromisso", 20),
  contactHeadline: requiredText("Titulo de contato", 8),
  contactDescription: requiredText("Descricao de contato", 20),
  careersHeadline: requiredText("Titulo de talentos", 8),
  careersDescription: requiredText("Descricao de talentos", 20),
  heroStats: requiredText("Metricas", 8),
  differentiators: requiredText("Diferenciais", 12),
  serviceSteps: requiredText("Etapas de atendimento", 12),
  audienceItems: requiredText("Publicos", 12),
  commitmentItems: requiredText("Compromissos", 8),
  homeSectionOrder: requiredText("Ordem das secoes", 0),
  featuredBrands: requiredText("Marcas", 4),
  trustSignals: requiredText("Sinais de confianca", 8),
});

export const adminLeadUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["novo", "em_contato", "qualificado", "proposta", "encerrado"]),
  priority: z.enum(["baixa", "media", "alta"]),
  notes: z.string().trim().max(1200).optional().or(z.literal("")),
});

export const adminApplicationUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["novo", "triagem", "entrevista", "aprovado", "encerrado"]),
  notes: z.string().trim().max(1200).optional().or(z.literal("")),
  isFavorite: z.boolean().default(false),
});

export function buildJobPayload(values: z.infer<typeof adminJobSchema>) {
  const slug = slugify(values.title);

  return {
    id: values.id || undefined,
    title: values.title,
    slug,
    department: values.department,
    location: values.location,
    work_model: values.workModel,
    contract_type: values.contractType,
    summary: values.summary,
    responsibilities: parseSimpleLines(values.responsibilities),
    requirements: parseSimpleLines(values.requirements),
    benefits: parseSimpleLines(values.benefits),
    status: values.status,
    featured_home: values.featuredHome,
    display_order: values.displayOrder,
    publish_at: values.publishAt || null,
    close_at: values.closeAt || null,
    published_at:
      values.status === "published"
        ? values.publishAt || new Date().toISOString()
        : null,
    closed_at:
      values.status === "closed"
        ? values.closeAt || new Date().toISOString()
        : null,
  };
}

export function buildProductCategoryPayload(
  values: z.infer<typeof adminProductCategorySchema>,
) {
  return {
    id: values.id || undefined,
    name: values.name,
    slug: slugify(values.name),
    description: values.description,
    display_order: values.displayOrder,
    is_active: values.isActive,
  };
}

export function buildProductPayload(values: z.infer<typeof adminProductSchema>) {
  return {
    id: values.id || undefined,
    category_id: values.categoryId,
    name: values.name,
    slug: slugify(values.name),
    summary: values.summary,
    description: values.description,
    ideal_for: values.idealFor,
    applications: parseSimpleLines(values.applications),
    differentials: parseSimpleLines(values.differentials),
    image_url: values.imageUrl || null,
    image_alt: values.imageAlt || null,
    is_featured: values.isFeatured,
    is_active: values.isActive,
    display_order: values.displayOrder,
  };
}

export function buildSiteSettingsPayload(
  values: z.infer<typeof adminSiteSettingsSchema>,
) {
  return {
    id: 1,
    hero_badge: values.heroBadge,
    hero_title: values.heroTitle,
    hero_description: values.heroDescription,
    hero_primary_label: values.heroPrimaryLabel,
    hero_primary_href: values.heroPrimaryHref,
    hero_secondary_label: values.heroSecondaryLabel,
    hero_secondary_href: values.heroSecondaryHref,
    hero_image_url: values.heroImageUrl,
    hero_image_alt: values.heroImageAlt,
    hero_eyebrow: values.heroEyebrow,
    campaign_label: values.campaignLabel,
    campaign_title: values.campaignTitle,
    campaign_description: values.campaignDescription,
    campaign_href: values.campaignHref,
    campaign_cta_label: values.campaignCtaLabel,
    proof_headline: values.proofHeadline,
    proof_description: values.proofDescription,
    products_headline: values.productsHeadline,
    products_description: values.productsDescription,
    audience_headline: values.audienceHeadline,
    audience_description: values.audienceDescription,
    service_headline: values.serviceHeadline,
    service_description: values.serviceDescription,
    commitment_headline: values.commitmentHeadline,
    commitment_description: values.commitmentDescription,
    contact_headline: values.contactHeadline,
    contact_description: values.contactDescription,
    careers_headline: values.careersHeadline,
    careers_description: values.careersDescription,
    hero_stats: parseTitledBodyLines(values.heroStats).map((item) => ({
      value: item.title,
      label: item.body,
    })),
    differentiators: parseTitledBodyLines(values.differentiators),
    service_steps: parseTitledBodyLines(values.serviceSteps),
    audience_items: parseTitledBodyLines(values.audienceItems),
    commitment_items: parseSimpleLines(values.commitmentItems),
    home_section_order: parseTitledBodyLines(values.homeSectionOrder).map((item) => ({
      id: item.title,
      label: item.body,
    })),
    featured_brands: parseSimpleLines(values.featuredBrands),
    trust_signals: parseSimpleLines(values.trustSignals),
  };
}
