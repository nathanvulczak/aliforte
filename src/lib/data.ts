import { cache } from "react";

import {
  mockApplications,
  mockCategories,
  mockJobs,
  mockLeads,
  mockProducts,
  mockSiteSettings,
} from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AdminDashboardData,
  CompanyLeadRecord,
  JobApplicationRecord,
  ProductCategory,
  ProductItem,
  SiteJob,
  SiteSettings,
} from "@/lib/types";

const validSectionIds = new Set([
  "credibilidade",
  "produtos",
  "atendimento",
  "publico",
  "compromisso",
  "contato",
  "talentos",
] as const);

function mapJob(row: Record<string, unknown>): SiteJob {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    department: String(row.department),
    location: String(row.location),
    workModel: String(row.work_model),
    contractType: String(row.contract_type),
    status: row.status as SiteJob["status"],
    summary: String(row.summary),
    responsibilities: Array.isArray(row.responsibilities)
      ? row.responsibilities.map(String)
      : [],
    requirements: Array.isArray(row.requirements)
      ? row.requirements.map(String)
      : [],
    benefits: Array.isArray(row.benefits) ? row.benefits.map(String) : [],
    featuredHome: Boolean(row.featured_home),
    displayOrder: Number(row.display_order ?? 0),
    publishAt: row.publish_at ? String(row.publish_at) : null,
    closeAt: row.close_at ? String(row.close_at) : null,
    createdAt: String(row.created_at),
    publishedAt: row.published_at ? String(row.published_at) : null,
    closedAt: row.closed_at ? String(row.closed_at) : null,
  };
}

function mapLead(row: Record<string, unknown>): CompanyLeadRecord {
  return {
    id: String(row.id),
    companyName: String(row.company_name),
    contactName: String(row.contact_name),
    cnpj: String(row.cnpj),
    city: String(row.city),
    phone: String(row.phone),
    email: String(row.email),
    message: row.message ? String(row.message) : null,
    status: row.status as CompanyLeadRecord["status"],
    priority: (row.priority as CompanyLeadRecord["priority"]) ?? "media",
    notes: row.notes ? String(row.notes) : null,
    createdAt: String(row.created_at),
  };
}

function mapApplication(row: Record<string, unknown>): JobApplicationRecord {
  const relatedJob = row.jobs as { title?: string } | null;

  return {
    id: String(row.id),
    jobId: String(row.job_id),
    jobTitle: relatedJob?.title ?? "Vaga",
    fullName: String(row.full_name),
    email: String(row.email),
    phone: String(row.phone),
    city: String(row.city),
    linkedin: row.linkedin ? String(row.linkedin) : null,
    message: row.message ? String(row.message) : null,
    resumePath: String(row.resume_path),
    status: row.status as JobApplicationRecord["status"],
    notes: row.notes ? String(row.notes) : null,
    isFavorite: Boolean(row.is_favorite),
    createdAt: String(row.created_at),
  };
}

function mapCategory(row: Record<string, unknown>): ProductCategory {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description),
    displayOrder: Number(row.display_order ?? 0),
    isActive: Boolean(row.is_active),
  };
}

function mapProduct(row: Record<string, unknown>): ProductItem {
  const relatedCategory = row.product_categories as { name?: string } | null;

  return {
    id: String(row.id),
    categoryId: String(row.category_id),
    categoryName: relatedCategory?.name ?? undefined,
    name: String(row.name),
    slug: String(row.slug),
    summary: String(row.summary),
    description: String(row.description),
    idealFor: String(row.ideal_for),
    applications: Array.isArray(row.applications) ? row.applications.map(String) : [],
    differentials: Array.isArray(row.differentials)
      ? row.differentials.map(String)
      : [],
    imageUrl: row.image_url ? String(row.image_url) : null,
    imageAlt: row.image_alt ? String(row.image_alt) : null,
    isFeatured: Boolean(row.is_featured),
    isActive: Boolean(row.is_active),
    displayOrder: Number(row.display_order ?? 0),
  };
}

function mapSiteSettings(row: Record<string, unknown> | null | undefined): SiteSettings {
  if (!row) return mockSiteSettings;

  return {
    heroBadge: String(row.hero_badge ?? mockSiteSettings.heroBadge),
    heroTitle: String(row.hero_title ?? mockSiteSettings.heroTitle),
    heroDescription: String(row.hero_description ?? mockSiteSettings.heroDescription),
    heroPrimaryLabel: String(
      row.hero_primary_label ?? mockSiteSettings.heroPrimaryLabel,
    ),
    heroPrimaryHref: String(row.hero_primary_href ?? mockSiteSettings.heroPrimaryHref),
    heroSecondaryLabel: String(
      row.hero_secondary_label ?? mockSiteSettings.heroSecondaryLabel,
    ),
    heroSecondaryHref: String(
      row.hero_secondary_href ?? mockSiteSettings.heroSecondaryHref,
    ),
    heroImageUrl: String(row.hero_image_url ?? mockSiteSettings.heroImageUrl),
    heroImageAlt: String(row.hero_image_alt ?? mockSiteSettings.heroImageAlt),
    heroEyebrow: String(row.hero_eyebrow ?? mockSiteSettings.heroEyebrow),
    campaignLabel: String(row.campaign_label ?? mockSiteSettings.campaignLabel),
    campaignTitle: String(row.campaign_title ?? mockSiteSettings.campaignTitle),
    campaignDescription: String(
      row.campaign_description ?? mockSiteSettings.campaignDescription,
    ),
    campaignHref: String(row.campaign_href ?? mockSiteSettings.campaignHref),
    campaignCtaLabel: String(
      row.campaign_cta_label ?? mockSiteSettings.campaignCtaLabel,
    ),
    proofHeadline: String(row.proof_headline ?? mockSiteSettings.proofHeadline),
    proofDescription: String(
      row.proof_description ?? mockSiteSettings.proofDescription,
    ),
    productsHeadline: String(
      row.products_headline ?? mockSiteSettings.productsHeadline,
    ),
    productsDescription: String(
      row.products_description ?? mockSiteSettings.productsDescription,
    ),
    audienceHeadline: String(
      row.audience_headline ?? mockSiteSettings.audienceHeadline,
    ),
    audienceDescription: String(
      row.audience_description ?? mockSiteSettings.audienceDescription,
    ),
    serviceHeadline: String(row.service_headline ?? mockSiteSettings.serviceHeadline),
    serviceDescription: String(
      row.service_description ?? mockSiteSettings.serviceDescription,
    ),
    commitmentHeadline: String(
      row.commitment_headline ?? mockSiteSettings.commitmentHeadline,
    ),
    commitmentDescription: String(
      row.commitment_description ?? mockSiteSettings.commitmentDescription,
    ),
    contactHeadline: String(row.contact_headline ?? mockSiteSettings.contactHeadline),
    contactDescription: String(
      row.contact_description ?? mockSiteSettings.contactDescription,
    ),
    careersHeadline: String(row.careers_headline ?? mockSiteSettings.careersHeadline),
    careersDescription: String(
      row.careers_description ?? mockSiteSettings.careersDescription,
    ),
    heroStats: Array.isArray(row.hero_stats)
      ? row.hero_stats.map((item) => ({
          value: String((item as { value?: string }).value ?? ""),
          label: String((item as { label?: string }).label ?? ""),
        }))
      : mockSiteSettings.heroStats,
    differentiators: Array.isArray(row.differentiators)
      ? row.differentiators.map((item) => ({
          title: String((item as { title?: string }).title ?? ""),
          body: String((item as { body?: string }).body ?? ""),
        }))
      : mockSiteSettings.differentiators,
    serviceSteps: Array.isArray(row.service_steps)
      ? row.service_steps.map((item) => ({
          title: String((item as { title?: string }).title ?? ""),
          body: String((item as { body?: string }).body ?? ""),
        }))
      : mockSiteSettings.serviceSteps,
    audienceItems: Array.isArray(row.audience_items)
      ? row.audience_items.map((item) => ({
          title: String((item as { title?: string }).title ?? ""),
          body: String((item as { body?: string }).body ?? ""),
        }))
      : mockSiteSettings.audienceItems,
    commitmentItems: Array.isArray(row.commitment_items)
      ? row.commitment_items.map(String)
      : mockSiteSettings.commitmentItems,
    homeSectionOrder: Array.isArray(row.home_section_order)
      ? row.home_section_order
          .map((item) => ({
            id: String((item as { id?: string }).id ?? ""),
            label: String((item as { label?: string }).label ?? ""),
          }))
          .filter(
            (
              item,
            ): item is SiteSettings["homeSectionOrder"][number] =>
              validSectionIds.has(
                item.id as
                  | "credibilidade"
                  | "produtos"
                  | "atendimento"
                  | "publico"
                  | "compromisso"
                  | "contato"
                  | "talentos",
              ) && Boolean(item.label),
          )
      : mockSiteSettings.homeSectionOrder,
    featuredBrands: Array.isArray(row.featured_brands)
      ? row.featured_brands.map(String)
      : mockSiteSettings.featuredBrands,
    trustSignals: Array.isArray(row.trust_signals)
      ? row.trust_signals.map(String)
      : mockSiteSettings.trustSignals,
  };
}

export const getSiteSettings = cache(async () => {
  if (!isSupabaseConfigured()) return mockSiteSettings;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return mockSiteSettings;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) return mockSiteSettings;
  return mapSiteSettings(data as Record<string, unknown> | null);
});

export const getProductsData = cache(async () => {
  if (!isSupabaseConfigured()) {
    return {
      categories: mockCategories.filter((item) => item.isActive),
      products: mockProducts.filter((item) => item.isActive),
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      categories: mockCategories.filter((item) => item.isActive),
      products: mockProducts.filter((item) => item.isActive),
    };
  }

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase
      .from("product_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("products")
      .select("*, product_categories(name)")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
  ]);

  return {
    categories: (categories ?? []).map((row) => mapCategory(row as Record<string, unknown>)),
    products: (products ?? []).map((row) => mapProduct(row as Record<string, unknown>)),
  };
});

export const getPublicJobs = cache(async () => {
  const now = Date.now();
  const isActiveForPublic = (job: SiteJob) => {
    if (job.status !== "published") return false;
    const publishAtTime = job.publishAt ? new Date(job.publishAt).getTime() : null;
    const closeAtTime = job.closeAt ? new Date(job.closeAt).getTime() : null;
    const publishAllowed = publishAtTime === null || publishAtTime <= now;
    const closeAllowed = closeAtTime === null || closeAtTime > now;
    return publishAllowed && closeAllowed;
  };

  if (!isSupabaseConfigured()) {
    return mockJobs
      .filter(isActiveForPublic)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return mockJobs
      .filter(isActiveForPublic)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error || !data) {
    return mockJobs
      .filter(isActiveForPublic)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  return data
    .map((row) => mapJob(row as Record<string, unknown>))
    .filter(isActiveForPublic);
});

export const getHomePageData = cache(async () => {
  const [settings, productsData, jobs] = await Promise.all([
    getSiteSettings(),
    getProductsData(),
    getPublicJobs(),
  ]);

  return {
    settings,
    categories: productsData.categories,
    products: productsData.products,
    featuredProducts: productsData.products.filter((item) => item.isFeatured).slice(0, 3),
    jobs,
  };
});

export const getAdminDashboardData = cache(async (): Promise<AdminDashboardData> => {
  if (!isSupabaseConfigured()) {
    return {
      isSupabaseConfigured: false,
      userEmail: null,
      settings: mockSiteSettings,
      categories: mockCategories,
      products: mockProducts,
      jobs: mockJobs,
      leads: mockLeads,
      applications: mockApplications,
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      isSupabaseConfigured: false,
      userEmail: null,
      settings: mockSiteSettings,
      categories: mockCategories,
      products: mockProducts,
      jobs: mockJobs,
      leads: mockLeads,
      applications: mockApplications,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isSupabaseConfigured: true,
      userEmail: null,
      settings: mockSiteSettings,
      categories: [],
      products: [],
      jobs: [],
      leads: [],
      applications: [],
    };
  }

  const [
    { data: settings },
    { data: categories },
    { data: products },
    { data: jobs },
    { data: leads },
    { data: applications },
  ] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("product_categories").select("*").order("display_order", { ascending: true }),
    supabase
      .from("products")
      .select("*, product_categories(name)")
      .order("display_order", { ascending: true }),
    supabase.from("jobs").select("*").order("display_order", { ascending: true }),
    supabase
      .from("company_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("job_applications")
      .select("*, jobs(title)")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  return {
    isSupabaseConfigured: true,
    userEmail: user.email ?? null,
    settings: mapSiteSettings(settings as Record<string, unknown> | null),
    categories: (categories ?? []).map((row) => mapCategory(row as Record<string, unknown>)),
    products: (products ?? []).map((row) => mapProduct(row as Record<string, unknown>)),
    jobs: (jobs ?? []).map((row) => mapJob(row as Record<string, unknown>)),
    leads: (leads ?? []).map((row) => mapLead(row as Record<string, unknown>)),
    applications: (applications ?? []).map((row) =>
      mapApplication(row as Record<string, unknown>),
    ),
  };
});
