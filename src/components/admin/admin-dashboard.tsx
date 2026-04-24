"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronDown,
  Download,
  FileText,
  Filter,
  FolderTree,
  ImageUp,
  LayoutTemplate,
  Mail,
  PackageSearch,
  PencilLine,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";

import type {
  AdminDashboardData,
  ApplicationStatus,
  LeadPriority,
  LeadStatus,
  ProductCategory,
  ProductItem,
  SiteJob,
  SiteSectionOrderItem,
  SiteSettings,
} from "@/lib/types";
import {
  formatCnpj,
  formatDatePtBR,
  formatDateTimeLocal,
  formatPhoneBR,
  statusLabel,
  stringifySimpleLines,
  stringifyTitledBodyLines,
} from "@/lib/formatters";

type AdminTab = "conteudo" | "produtos" | "operacao" | "vagas";
type DrawerKind = "job" | "product" | "category" | null;
type DrawerMode = "create" | "edit";

type JobDraft = {
  id: string;
  title: string;
  department: string;
  location: string;
  workModel: string;
  contractType: string;
  summary: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  status: "draft" | "published" | "closed";
  featuredHome: boolean;
  displayOrder: number;
  publishAt: string;
  closeAt: string;
};

type ProductDraft = {
  id: string;
  categoryId: string;
  name: string;
  summary: string;
  description: string;
  idealFor: string;
  applications: string;
  differentials: string;
  imageUrl: string;
  imageAlt: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
};

type CategoryDraft = {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
};

type SiteSettingsDraft = {
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroEyebrow: string;
  campaignLabel: string;
  campaignTitle: string;
  campaignDescription: string;
  campaignHref: string;
  campaignCtaLabel: string;
  proofHeadline: string;
  proofDescription: string;
  productsHeadline: string;
  productsDescription: string;
  audienceHeadline: string;
  audienceDescription: string;
  serviceHeadline: string;
  serviceDescription: string;
  commitmentHeadline: string;
  commitmentDescription: string;
  contactHeadline: string;
  contactDescription: string;
  careersHeadline: string;
  careersDescription: string;
  heroStats: string;
  differentiators: string;
  serviceSteps: string;
  audienceItems: string;
  commitmentItems: string;
  featuredBrands: string;
  trustSignals: string;
};

type LeadEditState = {
  status: LeadStatus;
  priority: LeadPriority;
  notes: string;
};

type ApplicationEditState = {
  status: ApplicationStatus;
  notes: string;
  isFavorite: boolean;
};

type FeedbackState = {
  tone: "success" | "error";
  message: string;
} | null;

const tabs: Array<{ id: AdminTab; label: string; icon: typeof LayoutTemplate }> = [
  { id: "conteudo", label: "Conteudo do site", icon: LayoutTemplate },
  { id: "produtos", label: "Produtos e linhas", icon: PackageSearch },
  { id: "operacao", label: "Leads e curriculos", icon: UsersRound },
  { id: "vagas", label: "Vagas", icon: BriefcaseBusiness },
];

const leadStatuses: LeadStatus[] = [
  "novo",
  "em_contato",
  "qualificado",
  "proposta",
  "encerrado",
];
const leadPriorities: LeadPriority[] = ["baixa", "media", "alta"];
const applicationStatuses: ApplicationStatus[] = [
  "novo",
  "triagem",
  "entrevista",
  "aprovado",
  "encerrado",
];
const jobStatuses: Array<JobDraft["status"]> = ["draft", "published", "closed"];

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-400";
const textareaClass = `${inputClass} min-h-28 resize-y`;

const emptyJobDraft: JobDraft = {
  id: "",
  title: "",
  department: "",
  location: "Guarapuava - PR",
  workModel: "Presencial",
  contractType: "CLT",
  summary: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  status: "draft",
  featuredHome: false,
  displayOrder: 0,
  publishAt: "",
  closeAt: "",
};

const emptyCategoryDraft: CategoryDraft = {
  id: "",
  name: "",
  description: "",
  displayOrder: 0,
  isActive: true,
};

function createEmptyProductDraft(categoryId = ""): ProductDraft {
  return {
    id: "",
    categoryId,
    name: "",
    summary: "",
    description: "",
    idealFor: "",
    applications: "",
    differentials: "",
    imageUrl: "",
    imageAlt: "",
    isFeatured: false,
    isActive: true,
    displayOrder: 0,
  };
}

function jobDraftFromJob(job: SiteJob): JobDraft {
  return {
    id: job.id,
    title: job.title,
    department: job.department,
    location: job.location,
    workModel: job.workModel,
    contractType: job.contractType,
    summary: job.summary,
    responsibilities: stringifySimpleLines(job.responsibilities),
    requirements: stringifySimpleLines(job.requirements),
    benefits: stringifySimpleLines(job.benefits),
    status: job.status,
    featuredHome: job.featuredHome,
    displayOrder: job.displayOrder,
    publishAt: formatDateTimeLocal(job.publishAt),
    closeAt: formatDateTimeLocal(job.closeAt),
  };
}

function productDraftFromProduct(product: ProductItem): ProductDraft {
  return {
    id: product.id,
    categoryId: product.categoryId,
    name: product.name,
    summary: product.summary,
    description: product.description,
    idealFor: product.idealFor,
    applications: stringifySimpleLines(product.applications),
    differentials: stringifySimpleLines(product.differentials),
    imageUrl: product.imageUrl ?? "",
    imageAlt: product.imageAlt ?? "",
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    displayOrder: product.displayOrder,
  };
}

function categoryDraftFromCategory(category: ProductCategory): CategoryDraft {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    displayOrder: category.displayOrder,
    isActive: category.isActive,
  };
}

function settingsDraftFromSettings(settings: SiteSettings): SiteSettingsDraft {
  return {
    heroBadge: settings.heroBadge,
    heroTitle: settings.heroTitle,
    heroDescription: settings.heroDescription,
    heroPrimaryLabel: settings.heroPrimaryLabel,
    heroPrimaryHref: settings.heroPrimaryHref,
    heroSecondaryLabel: settings.heroSecondaryLabel,
    heroSecondaryHref: settings.heroSecondaryHref,
    heroImageUrl: settings.heroImageUrl,
    heroImageAlt: settings.heroImageAlt,
    heroEyebrow: settings.heroEyebrow,
    campaignLabel: settings.campaignLabel,
    campaignTitle: settings.campaignTitle,
    campaignDescription: settings.campaignDescription,
    campaignHref: settings.campaignHref,
    campaignCtaLabel: settings.campaignCtaLabel,
    proofHeadline: settings.proofHeadline,
    proofDescription: settings.proofDescription,
    productsHeadline: settings.productsHeadline,
    productsDescription: settings.productsDescription,
    audienceHeadline: settings.audienceHeadline,
    audienceDescription: settings.audienceDescription,
    serviceHeadline: settings.serviceHeadline,
    serviceDescription: settings.serviceDescription,
    commitmentHeadline: settings.commitmentHeadline,
    commitmentDescription: settings.commitmentDescription,
    contactHeadline: settings.contactHeadline,
    contactDescription: settings.contactDescription,
    careersHeadline: settings.careersHeadline,
    careersDescription: settings.careersDescription,
    heroStats: stringifyTitledBodyLines(
      settings.heroStats.map((item) => ({ title: item.value, body: item.label })),
    ),
    differentiators: stringifyTitledBodyLines(settings.differentiators),
    serviceSteps: stringifyTitledBodyLines(settings.serviceSteps),
    audienceItems: stringifyTitledBodyLines(settings.audienceItems),
    commitmentItems: stringifySimpleLines(settings.commitmentItems),
    featuredBrands: stringifySimpleLines(settings.featuredBrands),
    trustSignals: stringifySimpleLines(settings.trustSignals),
  };
}

function buildLeadEdits(dashboard: AdminDashboardData) {
  return Object.fromEntries(
    dashboard.leads.map((lead) => [
      lead.id,
      {
        status: lead.status,
        priority: lead.priority,
        notes: lead.notes ?? "",
      },
    ]),
  ) as Record<string, LeadEditState>;
}

function buildApplicationEdits(dashboard: AdminDashboardData) {
  return Object.fromEntries(
    dashboard.applications.map((application) => [
      application.id,
      {
        status: application.status,
        notes: application.notes ?? "",
        isFavorite: application.isFavorite,
      },
    ]),
  ) as Record<string, ApplicationEditState>;
}

function badgeClass(tone: "brand" | "slate" | "success" | "gold") {
  if (tone === "brand") return "bg-brand-50 text-brand-700 border border-brand-100";
  if (tone === "success") return "bg-emerald-50 text-emerald-700 border border-emerald-100";
  if (tone === "gold") return "bg-amber-50 text-amber-700 border border-amber-100";
  return "bg-slate-100 text-slate-700 border border-slate-200";
}

async function parseJsonResponse<T extends Record<string, unknown>>(response: Response) {
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as T) : ({} as T);

  if (!response.ok) {
    throw new Error(String(payload.message ?? "Nao foi possivel concluir a acao."));
  }

  return payload;
}

export function AdminDashboard({
  dashboard,
  errorMessage,
  successMessage,
}: {
  dashboard: AdminDashboardData;
  errorMessage?: string;
  successMessage?: string;
}) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<AdminTab>("conteudo");
  const [drawerKind, setDrawerKind] = useState<DrawerKind>(null);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [jobDraft, setJobDraft] = useState<JobDraft>(emptyJobDraft);
  const [productDraft, setProductDraft] = useState<ProductDraft>(
    createEmptyProductDraft(dashboard.categories[0]?.id ?? ""),
  );
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft>(emptyCategoryDraft);
  const [settingsDraft, setSettingsDraft] = useState<SiteSettingsDraft>(
    settingsDraftFromSettings(dashboard.settings),
  );
  const [sectionOrder, setSectionOrder] = useState<SiteSectionOrderItem[]>(
    dashboard.settings.homeSectionOrder,
  );

  const [leadQuery, setLeadQuery] = useState("");
  const [leadStatus, setLeadStatus] = useState("all");
  const [leadCity, setLeadCity] = useState("");
  const [leadDateFrom, setLeadDateFrom] = useState("");
  const [applicationQuery, setApplicationQuery] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("all");
  const [applicationCity, setApplicationCity] = useState("");
  const [applicationDateFrom, setApplicationDateFrom] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [jobQuery, setJobQuery] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);
  const [leadEdits, setLeadEdits] = useState<Record<string, LeadEditState>>(
    buildLeadEdits(dashboard),
  );
  const [applicationEdits, setApplicationEdits] = useState<
    Record<string, ApplicationEditState>
  >(buildApplicationEdits(dashboard));
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(
    errorMessage
      ? { tone: "error", message: errorMessage }
      : successMessage
        ? { tone: "success", message: successMessage }
        : null,
  );

  const heroImageInputRef = useRef<HTMLInputElement | null>(null);
  const productImageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (drawerKind) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow || "";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerKind]);

  const categoryMap = useMemo(
    () => new Map(dashboard.categories.map((category) => [category.id, category])),
    [dashboard.categories],
  );

  const filteredProducts = useMemo(() => {
    return dashboard.products.filter((product) => {
      const haystack =
        `${product.name} ${product.summary} ${product.categoryName ?? ""}`.toLowerCase();
      const queryMatches = haystack.includes(productQuery.toLowerCase());
      const categoryMatches =
        productCategoryFilter === "all" || product.categoryId === productCategoryFilter;
      return queryMatches && categoryMatches;
    });
  }, [dashboard.products, productCategoryFilter, productQuery]);

  const filteredJobs = useMemo(() => {
    return dashboard.jobs.filter((job) => {
      const haystack = `${job.title} ${job.department} ${job.location}`.toLowerCase();
      const queryMatches = haystack.includes(jobQuery.toLowerCase());
      const statusMatches = jobStatusFilter === "all" || job.status === jobStatusFilter;
      return queryMatches && statusMatches;
    });
  }, [dashboard.jobs, jobQuery, jobStatusFilter]);

  const filteredLeads = useMemo(() => {
    return dashboard.leads.filter((lead) => {
      const haystack =
        `${lead.companyName} ${lead.contactName} ${lead.city} ${lead.email}`.toLowerCase();
      const queryMatches = haystack.includes(leadQuery.toLowerCase());
      const statusMatches = leadStatus === "all" || lead.status === leadStatus;
      const cityMatches = !leadCity || lead.city.toLowerCase().includes(leadCity.toLowerCase());
      const dateMatches =
        !leadDateFrom || new Date(lead.createdAt) >= new Date(`${leadDateFrom}T00:00:00`);
      return queryMatches && statusMatches && cityMatches && dateMatches;
    });
  }, [dashboard.leads, leadCity, leadDateFrom, leadQuery, leadStatus]);

  const filteredApplications = useMemo(() => {
    return dashboard.applications.filter((application) => {
      const haystack =
        `${application.fullName} ${application.jobTitle} ${application.city} ${application.email}`.toLowerCase();
      const queryMatches = haystack.includes(applicationQuery.toLowerCase());
      const statusMatches =
        applicationStatus === "all" || application.status === applicationStatus;
      const cityMatches =
        !applicationCity ||
        application.city.toLowerCase().includes(applicationCity.toLowerCase());
      const dateMatches =
        !applicationDateFrom ||
        new Date(application.createdAt) >= new Date(`${applicationDateFrom}T00:00:00`);
      const favoriteMatches = !favoritesOnly || application.isFavorite;
      return (
        queryMatches &&
        statusMatches &&
        cityMatches &&
        dateMatches &&
        favoriteMatches
      );
    });
  }, [
    applicationCity,
    applicationDateFrom,
    applicationQuery,
    applicationStatus,
    dashboard.applications,
    favoritesOnly,
  ]);

  const metrics = useMemo(
    () => [
      {
        label: "Produtos ativos",
        value: String(dashboard.products.filter((item) => item.isActive).length),
        helper: `${dashboard.categories.filter((item) => item.isActive).length} categorias`,
        tone: "brand" as const,
      },
      {
        label: "Leads comerciais",
        value: String(dashboard.leads.length),
        helper: `${dashboard.leads.filter((item) => item.priority === "alta").length} prioridade alta`,
        tone: "success" as const,
      },
      {
        label: "Curriculos",
        value: String(dashboard.applications.length),
        helper: `${dashboard.applications.filter((item) => item.isFavorite).length} favoritos`,
        tone: "gold" as const,
      },
      {
        label: "Vagas",
        value: String(dashboard.jobs.length),
        helper: `${dashboard.jobs.filter((item) => item.status === "published").length} publicadas`,
        tone: "slate" as const,
      },
    ],
    [dashboard.applications, dashboard.categories, dashboard.jobs, dashboard.leads, dashboard.products],
  );

  function closeDrawer() {
    setDrawerKind(null);
    setPendingKey(null);
  }

  function openJobDrawer(mode: DrawerMode, job?: SiteJob) {
    setDrawerKind("job");
    setDrawerMode(mode);
    setJobDraft(job ? jobDraftFromJob(job) : emptyJobDraft);
  }

  function openProductDrawer(mode: DrawerMode, product?: ProductItem) {
    setDrawerKind("product");
    setDrawerMode(mode);
    setProductDraft(
      product
        ? productDraftFromProduct(product)
        : createEmptyProductDraft(dashboard.categories[0]?.id ?? ""),
    );
  }

  function openCategoryDrawer(mode: DrawerMode, category?: ProductCategory) {
    setDrawerKind("category");
    setDrawerMode(mode);
    setCategoryDraft(category ? categoryDraftFromCategory(category) : emptyCategoryDraft);
  }

  function updateFeedback(tone: "success" | "error", message: string) {
    setFeedback({ tone, message });
  }

  function refreshDashboard() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function saveSettings() {
    setPendingKey("save-settings");

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settingsDraft,
          homeSectionOrder: stringifyTitledBodyLines(
            sectionOrder.map((item) => ({ title: item.id, body: item.label })),
          ),
        }),
      });

      await parseJsonResponse(response);
      updateFeedback("success", "Conteudo do site atualizado com sucesso.");
      refreshDashboard();
    } catch (error) {
      updateFeedback(
        "error",
        error instanceof Error ? error.message : "Nao foi possivel salvar o conteudo.",
      );
    } finally {
      setPendingKey(null);
    }
  }

  async function uploadMedia(file: File, target: "hero" | "product") {
    setPendingKey(`upload-${target}`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const payload = await parseJsonResponse<{ publicUrl: string }>(response);

      if (target === "hero") {
        setSettingsDraft((current) => ({ ...current, heroImageUrl: payload.publicUrl }));
      } else {
        setProductDraft((current) => ({ ...current, imageUrl: payload.publicUrl }));
      }

      updateFeedback("success", "Imagem enviada e pronta para uso.");
    } catch (error) {
      updateFeedback(
        "error",
        error instanceof Error ? error.message : "Nao foi possivel enviar a imagem.",
      );
    } finally {
      setPendingKey(null);
    }
  }

  async function saveCategory() {
    setPendingKey("save-category");

    try {
      const response = await fetch("/api/admin/products", {
        method: drawerMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "category",
          ...categoryDraft,
        }),
      });

      await parseJsonResponse(response);
      updateFeedback(
        "success",
        drawerMode === "create"
          ? "Categoria cadastrada com sucesso."
          : "Categoria atualizada com sucesso.",
      );
      closeDrawer();
      refreshDashboard();
    } catch (error) {
      updateFeedback(
        "error",
        error instanceof Error ? error.message : "Nao foi possivel salvar a categoria.",
      );
    } finally {
      setPendingKey(null);
    }
  }

  async function deleteCategory() {
    if (!categoryDraft.id) return;
    setPendingKey("delete-category");

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "category", id: categoryDraft.id }),
      });

      await parseJsonResponse(response);
      updateFeedback("success", "Categoria removida com sucesso.");
      closeDrawer();
      refreshDashboard();
    } catch (error) {
      updateFeedback(
        "error",
        error instanceof Error ? error.message : "Nao foi possivel remover a categoria.",
      );
    } finally {
      setPendingKey(null);
    }
  }

  async function saveProduct() {
    setPendingKey("save-product");

    try {
      const response = await fetch("/api/admin/products", {
        method: drawerMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "product",
          ...productDraft,
        }),
      });

      await parseJsonResponse(response);
      updateFeedback(
        "success",
        drawerMode === "create"
          ? "Produto cadastrado com sucesso."
          : "Produto atualizado com sucesso.",
      );
      closeDrawer();
      refreshDashboard();
    } catch (error) {
      updateFeedback(
        "error",
        error instanceof Error ? error.message : "Nao foi possivel salvar o produto.",
      );
    } finally {
      setPendingKey(null);
    }
  }

  async function deleteProduct() {
    if (!productDraft.id) return;
    setPendingKey("delete-product");

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "product", id: productDraft.id }),
      });

      await parseJsonResponse(response);
      updateFeedback("success", "Produto removido com sucesso.");
      closeDrawer();
      refreshDashboard();
    } catch (error) {
      updateFeedback(
        "error",
        error instanceof Error ? error.message : "Nao foi possivel remover o produto.",
      );
    } finally {
      setPendingKey(null);
    }
  }

  async function saveJob() {
    setPendingKey("save-job");

    try {
      const response = await fetch("/api/admin/jobs", {
        method: drawerMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobDraft),
      });

      await parseJsonResponse(response);
      updateFeedback(
        "success",
        drawerMode === "create"
          ? "Vaga cadastrada com sucesso."
          : "Vaga atualizada com sucesso.",
      );
      closeDrawer();
      refreshDashboard();
    } catch (error) {
      updateFeedback(
        "error",
        error instanceof Error ? error.message : "Nao foi possivel salvar a vaga.",
      );
    } finally {
      setPendingKey(null);
    }
  }

  async function duplicateJob(id: string) {
    setPendingKey(`duplicate-${id}`);

    try {
      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", id }),
      });

      await parseJsonResponse(response);
      updateFeedback("success", "Vaga duplicada em rascunho.");
      refreshDashboard();
    } catch (error) {
      updateFeedback(
        "error",
        error instanceof Error ? error.message : "Nao foi possivel duplicar a vaga.",
      );
    } finally {
      setPendingKey(null);
    }
  }

  async function deleteJob() {
    if (!jobDraft.id) return;
    setPendingKey("delete-job");

    try {
      const response = await fetch("/api/admin/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobDraft.id }),
      });

      await parseJsonResponse(response);
      updateFeedback("success", "Vaga removida com sucesso.");
      closeDrawer();
      refreshDashboard();
    } catch (error) {
      updateFeedback(
        "error",
        error instanceof Error ? error.message : "Nao foi possivel remover a vaga.",
      );
    } finally {
      setPendingKey(null);
    }
  }

  async function saveLead(id: string) {
    setPendingKey(`lead-${id}`);

    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: leadEdits[id].status,
          priority: leadEdits[id].priority,
          notes: leadEdits[id].notes,
        }),
      });

      await parseJsonResponse(response);
      updateFeedback("success", "Lead atualizado com sucesso.");
      refreshDashboard();
    } catch (error) {
      updateFeedback(
        "error",
        error instanceof Error ? error.message : "Nao foi possivel atualizar o lead.",
      );
    } finally {
      setPendingKey(null);
    }
  }

  async function saveApplication(id: string) {
    setPendingKey(`application-${id}`);

    try {
      const response = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: applicationEdits[id].status,
          notes: applicationEdits[id].notes,
          isFavorite: applicationEdits[id].isFavorite,
        }),
      });

      await parseJsonResponse(response);
      updateFeedback("success", "Candidatura atualizada com sucesso.");
      refreshDashboard();
    } catch (error) {
      updateFeedback(
        "error",
        error instanceof Error
          ? error.message
          : "Nao foi possivel atualizar a candidatura.",
      );
    } finally {
      setPendingKey(null);
    }
  }

  function moveSection(id: string, direction: "up" | "down") {
    setSectionOrder((current) => {
      const index = current.findIndex((item) => item.id === id);
      if (index < 0) return current;

      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const cloned = [...current];
      const [item] = cloned.splice(index, 1);
      cloned.splice(nextIndex, 0, item);
      return cloned;
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="soft-card rounded-[1.75rem] p-5">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${badgeClass(metric.tone)}`}
            >
              {metric.label}
            </span>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{metric.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{metric.helper}</p>
          </div>
        ))}
      </div>

      {feedback ? (
        <p
          className={`rounded-2xl px-4 py-3 text-sm ${
            feedback.tone === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </p>
      ) : null}

      <div className="soft-card overflow-hidden rounded-[2rem] p-2">
        <div className="flex gap-2 overflow-x-auto rounded-[1.6rem] bg-white/70 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex min-w-max items-center gap-2 rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition ${
                  selected
                    ? "bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${selected ? "text-brand-300" : "text-brand-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "conteudo" ? (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <section className="warm-surface rounded-[2rem] border border-slate-200 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-brand-700">
                    Home e banner principal
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[0.06em] text-slate-950">
                    Hero, campanha e prova de confianca
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => heroImageInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600"
                >
                  <ImageUp className="h-4 w-4 text-brand-500" />
                  Trocar banner
                </button>
              </div>

              <input
                ref={heroImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadMedia(file, "hero");
                    event.target.value = "";
                  }
                }}
              />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Selo</label>
                  <input
                    className={inputClass}
                    value={settingsDraft.heroBadge}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        heroBadge: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Titulo principal
                  </label>
                  <textarea
                    className={textareaClass}
                    value={settingsDraft.heroTitle}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        heroTitle: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Descricao principal
                  </label>
                  <textarea
                    className={textareaClass}
                    value={settingsDraft.heroDescription}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        heroDescription: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    CTA principal
                  </label>
                  <input
                    className={inputClass}
                    value={settingsDraft.heroPrimaryLabel}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        heroPrimaryLabel: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Link CTA principal
                  </label>
                  <input
                    className={inputClass}
                    value={settingsDraft.heroPrimaryHref}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        heroPrimaryHref: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    CTA secundario
                  </label>
                  <input
                    className={inputClass}
                    value={settingsDraft.heroSecondaryLabel}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        heroSecondaryLabel: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Link CTA secundario
                  </label>
                  <input
                    className={inputClass}
                    value={settingsDraft.heroSecondaryHref}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        heroSecondaryHref: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Linha de apoio
                  </label>
                  <input
                    className={inputClass}
                    value={settingsDraft.heroEyebrow}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        heroEyebrow: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Texto alternativo da imagem
                  </label>
                  <input
                    className={inputClass}
                    value={settingsDraft.heroImageAlt}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        heroImageAlt: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    URL da imagem principal
                  </label>
                  <input
                    className={inputClass}
                    value={settingsDraft.heroImageUrl}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        heroImageUrl: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-4 rounded-[1.7rem] border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Label da campanha
                  </label>
                  <input
                    className={inputClass}
                    value={settingsDraft.campaignLabel}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        campaignLabel: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    CTA da campanha
                  </label>
                  <input
                    className={inputClass}
                    value={settingsDraft.campaignCtaLabel}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        campaignCtaLabel: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Titulo da campanha
                  </label>
                  <textarea
                    className={textareaClass}
                    value={settingsDraft.campaignTitle}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        campaignTitle: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Descricao da campanha
                  </label>
                  <textarea
                    className={textareaClass}
                    value={settingsDraft.campaignDescription}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        campaignDescription: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Link da campanha
                  </label>
                  <input
                    className={inputClass}
                    value={settingsDraft.campaignHref}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        campaignHref: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </section>

            <section className="soft-card rounded-[2rem] p-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-brand-500" />
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-brand-700">
                    Editar blocos da home
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.06em] text-slate-950">
                    Storytelling, produtos, publico e talentos
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  ["proofHeadline", "Titulo de credibilidade"],
                  ["productsHeadline", "Titulo de produtos"],
                  ["audienceHeadline", "Titulo de publico"],
                  ["serviceHeadline", "Titulo de atendimento"],
                  ["commitmentHeadline", "Titulo de compromisso"],
                  ["contactHeadline", "Titulo de contato"],
                  ["careersHeadline", "Titulo de talentos"],
                ].map(([field, label]) => (
                  <div key={field}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
                    <input
                      className={inputClass}
                      value={settingsDraft[field as keyof SiteSettingsDraft] as string}
                      onChange={(event) =>
                        setSettingsDraft((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
                {[
                  ["proofDescription", "Descricao de credibilidade"],
                  ["productsDescription", "Descricao de produtos"],
                  ["audienceDescription", "Descricao de publico"],
                  ["serviceDescription", "Descricao de atendimento"],
                  ["commitmentDescription", "Descricao de compromisso"],
                  ["contactDescription", "Descricao de contato"],
                  ["careersDescription", "Descricao de talentos"],
                ].map(([field, label]) => (
                  <div key={field} className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
                    <textarea
                      className={textareaClass}
                      value={settingsDraft[field as keyof SiteSettingsDraft] as string}
                      onChange={(event) =>
                        setSettingsDraft((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="soft-card rounded-[2rem] p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-brand-500" />
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-brand-700">
                    Listas editaveis
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.06em] text-slate-950">
                    Metricas, diferenciais e sinais de confianca
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Metricas do hero
                  </label>
                  <p className="mb-2 text-xs leading-6 text-slate-500">
                    Use o formato: valor | descricao
                  </p>
                  <textarea
                    className={textareaClass}
                    value={settingsDraft.heroStats}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        heroStats: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Cards de diferenciais
                  </label>
                  <p className="mb-2 text-xs leading-6 text-slate-500">
                    Use o formato: titulo | descricao
                  </p>
                  <textarea
                    className={textareaClass}
                    value={settingsDraft.differentiators}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        differentiators: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Etapas de atendimento
                  </label>
                  <p className="mb-2 text-xs leading-6 text-slate-500">
                    Use o formato: titulo | descricao
                  </p>
                  <textarea
                    className={textareaClass}
                    value={settingsDraft.serviceSteps}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        serviceSteps: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Publicos atendidos
                  </label>
                  <p className="mb-2 text-xs leading-6 text-slate-500">
                    Use o formato: titulo | descricao
                  </p>
                  <textarea
                    className={textareaClass}
                    value={settingsDraft.audienceItems}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        audienceItems: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Compromissos
                  </label>
                  <p className="mb-2 text-xs leading-6 text-slate-500">
                    Um item por linha
                  </p>
                  <textarea
                    className={textareaClass}
                    value={settingsDraft.commitmentItems}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        commitmentItems: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Marcas ou linhas em destaque
                  </label>
                  <p className="mb-2 text-xs leading-6 text-slate-500">
                    Um item por linha
                  </p>
                  <textarea
                    className={textareaClass}
                    value={settingsDraft.featuredBrands}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        featuredBrands: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Sinais de confianca
                  </label>
                  <p className="mb-2 text-xs leading-6 text-slate-500">
                    Um item por linha
                  </p>
                  <textarea
                    className={textareaClass}
                    value={settingsDraft.trustSignals}
                    onChange={(event) =>
                      setSettingsDraft((current) => ({
                        ...current,
                        trustSignals: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </section>

            <section className="soft-card rounded-[2rem] p-6">
              <div className="flex items-center gap-3">
                <FolderTree className="h-5 w-5 text-brand-500" />
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-brand-700">
                    Ordem das secoes
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.06em] text-slate-950">
                    Ritmo da home
                  </h2>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {sectionOrder.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-slate-200 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Bloco {index + 1}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => moveSection(item.id, "up")}
                        className="rounded-full border border-slate-200 p-2 text-slate-600 hover:border-brand-300 hover:text-brand-600"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(item.id, "down")}
                        className="rounded-full border border-slate-200 p-2 text-slate-600 hover:border-brand-300 hover:text-brand-600"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => void saveSettings()}
                disabled={pendingKey === "save-settings" || isRefreshing}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-400 disabled:opacity-70"
              >
                Salvar conteudo do site
              </button>
            </section>
          </div>
        </div>
      ) : null}

      {activeTab === "produtos" ? (
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <section className="soft-card rounded-[2rem] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-brand-700">
                    Categorias
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.06em] text-slate-950">
                    Linhas e familias comerciais
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => openCategoryDrawer("create")}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4 text-brand-300" />
                  Nova categoria
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {dashboard.categories.map((category) => (
                  <article
                    key={category.id}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${badgeClass("brand")}`}
                          >
                            Ordem {category.displayOrder}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                              category.isActive ? badgeClass("success") : badgeClass("slate")
                            }`}
                          >
                            {category.isActive ? "Ativa" : "Oculta"}
                          </span>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-slate-950">
                          {category.name}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {category.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openCategoryDrawer("edit", category)}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600"
                      >
                        Editar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="soft-card rounded-[2rem] p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-brand-700">
                    Produtos e linhas
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.06em] text-slate-950">
                    Cadastro, destaque e ativacao
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => openProductDrawer("create")}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400"
                >
                  <Plus className="h-4 w-4" />
                  Novo produto
                </button>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px]">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className={`${inputClass} pl-11`}
                    value={productQuery}
                    onChange={(event) => setProductQuery(event.target.value)}
                    placeholder="Buscar por nome, resumo ou categoria"
                  />
                </label>
                <label className="relative">
                  <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    className={`${inputClass} pl-11`}
                    value={productCategoryFilter}
                    onChange={(event) => setProductCategoryFilter(event.target.value)}
                  >
                    <option value="all">Todas as categorias</option>
                    {dashboard.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
                  >
                    <div className="relative h-44 bg-[linear-gradient(135deg,#fff8f4,#f3ede6)]">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.imageAlt ?? product.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          <PackageSearch className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-4 p-5">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${badgeClass("brand")}`}
                        >
                          {product.categoryName ?? categoryMap.get(product.categoryId)?.name}
                        </span>
                        {product.isFeatured ? (
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${badgeClass("gold")}`}
                          >
                            Destaque
                          </span>
                        ) : null}
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                            product.isActive ? badgeClass("success") : badgeClass("slate")
                          }`}
                        >
                          {product.isActive ? "Ativo" : "Oculto"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-950">{product.name}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {product.summary}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                          Ordem {product.displayOrder}
                        </p>
                        <button
                          type="button"
                          onClick={() => openProductDrawer("edit", product)}
                          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600"
                        >
                          Editar produto
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : null}

      {activeTab === "operacao" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="soft-card rounded-[2rem] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-500" />
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-brand-700">
                    Leads comerciais
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.06em] text-slate-950">
                    Contatos e acompanhamento
                  </h2>
                </div>
              </div>
              <a
                href="/api/admin/leads/export"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600"
              >
                <Download className="h-4 w-4 text-brand-500" />
                Exportar CSV
              </a>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <label className="relative md:col-span-2">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className={`${inputClass} pl-11`}
                  value={leadQuery}
                  onChange={(event) => setLeadQuery(event.target.value)}
                  placeholder="Buscar empresa, responsavel, cidade ou e-mail"
                />
              </label>
              <label className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  className={`${inputClass} pl-11`}
                  value={leadStatus}
                  onChange={(event) => setLeadStatus(event.target.value)}
                >
                  <option value="all">Todos os status</option>
                  {leadStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>
              <input
                className={inputClass}
                value={leadCity}
                onChange={(event) => setLeadCity(event.target.value)}
                placeholder="Filtrar por cidade"
              />
              <input
                type="date"
                className={inputClass}
                value={leadDateFrom}
                onChange={(event) => setLeadDateFrom(event.target.value)}
              />
            </div>

            <div className="mt-6 space-y-3">
              {filteredLeads.map((lead) => {
                const expanded = expandedLeadId === lead.id;
                const editState = leadEdits[lead.id];

                return (
                  <article
                    key={lead.id}
                    className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedLeadId(expanded ? null : lead.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <div>
                        <p className="font-semibold text-slate-950">{lead.companyName}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {lead.contactName} • {lead.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${badgeClass("brand")}`}
                        >
                          {statusLabel(lead.status)}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {expanded ? (
                      <div className="space-y-5 border-t border-slate-200 px-5 py-5">
                        <div className="grid gap-2 text-sm leading-7 text-slate-600">
                          <p>CNPJ: {formatCnpj(lead.cnpj)}</p>
                          <p>Telefone: {formatPhoneBR(lead.phone)}</p>
                          <p>E-mail: {lead.email}</p>
                          <p>Recebido em: {formatDatePtBR(lead.createdAt)}</p>
                          {lead.message ? <p>Mensagem: {lead.message}</p> : null}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Status
                            </label>
                            <select
                              className={inputClass}
                              value={editState?.status ?? lead.status}
                              onChange={(event) =>
                                setLeadEdits((current) => ({
                                  ...current,
                                  [lead.id]: {
                                    ...current[lead.id],
                                    status: event.target.value as LeadStatus,
                                  },
                                }))
                              }
                            >
                              {leadStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {statusLabel(status)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Prioridade
                            </label>
                            <select
                              className={inputClass}
                              value={editState?.priority ?? lead.priority}
                              onChange={(event) =>
                                setLeadEdits((current) => ({
                                  ...current,
                                  [lead.id]: {
                                    ...current[lead.id],
                                    priority: event.target.value as LeadPriority,
                                  },
                                }))
                              }
                            >
                              {leadPriorities.map((priority) => (
                                <option key={priority} value={priority}>
                                  {statusLabel(priority)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Observacoes internas
                            </label>
                            <textarea
                              className={textareaClass}
                              value={editState?.notes ?? lead.notes ?? ""}
                              onChange={(event) =>
                                setLeadEdits((current) => ({
                                  ...current,
                                  [lead.id]: {
                                    ...current[lead.id],
                                    notes: event.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => void saveLead(lead.id)}
                          disabled={pendingKey === `lead-${lead.id}` || isRefreshing}
                          className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400 disabled:opacity-70"
                        >
                          Salvar lead
                        </button>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="soft-card rounded-[2rem] p-6">
            <div className="flex items-center gap-3">
              <UsersRound className="h-5 w-5 text-brand-500" />
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-brand-700">
                  Curriculos
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.06em] text-slate-950">
                  Candidaturas e triagem
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <label className="relative md:col-span-2">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className={`${inputClass} pl-11`}
                  value={applicationQuery}
                  onChange={(event) => setApplicationQuery(event.target.value)}
                  placeholder="Buscar candidato, vaga, cidade ou e-mail"
                />
              </label>
              <label className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  className={`${inputClass} pl-11`}
                  value={applicationStatus}
                  onChange={(event) => setApplicationStatus(event.target.value)}
                >
                  <option value="all">Todos os status</option>
                  {applicationStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>
              <input
                className={inputClass}
                value={applicationCity}
                onChange={(event) => setApplicationCity(event.target.value)}
                placeholder="Filtrar por cidade"
              />
              <input
                type="date"
                className={inputClass}
                value={applicationDateFrom}
                onChange={(event) => setApplicationDateFrom(event.target.value)}
              />
              <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 md:col-span-2">
                <input
                  type="checkbox"
                  checked={favoritesOnly}
                  onChange={(event) => setFavoritesOnly(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-300"
                />
                Mostrar apenas favoritos
              </label>
            </div>

            <div className="mt-6 space-y-3">
              {filteredApplications.map((application) => {
                const expanded = expandedApplicationId === application.id;
                const editState = applicationEdits[application.id];

                return (
                  <article
                    key={application.id}
                    className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedApplicationId(expanded ? null : application.id)
                      }
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-950">{application.fullName}</p>
                          {application.isFavorite ? (
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {application.jobTitle} • {application.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${badgeClass("brand")}`}
                        >
                          {statusLabel(application.status)}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {expanded ? (
                      <div className="space-y-5 border-t border-slate-200 px-5 py-5">
                        <div className="grid gap-2 text-sm leading-7 text-slate-600">
                          <p>Telefone: {formatPhoneBR(application.phone)}</p>
                          <p>E-mail: {application.email}</p>
                          <p>Recebido em: {formatDatePtBR(application.createdAt)}</p>
                          {application.linkedin ? <p>LinkedIn: {application.linkedin}</p> : null}
                          {application.message ? <p>Mensagem: {application.message}</p> : null}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Status
                            </label>
                            <select
                              className={inputClass}
                              value={editState?.status ?? application.status}
                              onChange={(event) =>
                                setApplicationEdits((current) => ({
                                  ...current,
                                  [application.id]: {
                                    ...current[application.id],
                                    status: event.target.value as ApplicationStatus,
                                  },
                                }))
                              }
                            >
                              {applicationStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {statusLabel(status)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              checked={editState?.isFavorite ?? application.isFavorite}
                              onChange={(event) =>
                                setApplicationEdits((current) => ({
                                  ...current,
                                  [application.id]: {
                                    ...current[application.id],
                                    isFavorite: event.target.checked,
                                  },
                                }))
                              }
                              className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-300"
                            />
                            Marcar como favorito
                          </label>
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Observacoes internas
                            </label>
                            <textarea
                              className={textareaClass}
                              value={editState?.notes ?? application.notes ?? ""}
                              onChange={(event) =>
                                setApplicationEdits((current) => ({
                                  ...current,
                                  [application.id]: {
                                    ...current[application.id],
                                    notes: event.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <a
                            href={`/api/admin/resume?path=${encodeURIComponent(application.resumePath)}`}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600"
                          >
                            <Download className="h-4 w-4 text-brand-500" />
                            Baixar curriculo
                          </a>
                          <button
                            type="button"
                            onClick={() => void saveApplication(application.id)}
                            disabled={
                              pendingKey === `application-${application.id}` || isRefreshing
                            }
                            className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400 disabled:opacity-70"
                          >
                            Salvar candidatura
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "vagas" ? (
        <section className="soft-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-brand-700">Vagas</p>
              <h2 className="mt-1 font-display text-3xl font-semibold uppercase tracking-[0.06em] text-slate-950">
                Cadastro, destaque na home e agenda de publicacao
              </h2>
            </div>
            <button
              type="button"
              onClick={() => openJobDrawer("create")}
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-400"
            >
              <Plus className="h-4 w-4" />
              Cadastrar vaga
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className={`${inputClass} pl-11`}
                value={jobQuery}
                onChange={(event) => setJobQuery(event.target.value)}
                placeholder="Buscar vaga, area ou local"
              />
            </label>
            <label className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                className={`${inputClass} pl-11`}
                value={jobStatusFilter}
                onChange={(event) => setJobStatusFilter(event.target.value)}
              >
                <option value="all">Todos os status</option>
                {jobStatuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]"
              >
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${badgeClass("brand")}`}
                  >
                    {job.department}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                      job.status === "published"
                        ? badgeClass("success")
                        : job.status === "closed"
                          ? badgeClass("slate")
                          : badgeClass("gold")
                    }`}
                  >
                    {statusLabel(job.status)}
                  </span>
                  {job.featuredHome ? (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${badgeClass("gold")}`}
                    >
                      Destaque na home
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-slate-950">{job.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{job.summary}</p>
                <div className="mt-5 grid gap-2 text-sm text-slate-600">
                  <p>Local: {job.location}</p>
                  <p>Modelo: {job.workModel}</p>
                  <p>Contrato: {job.contractType}</p>
                  <p>Ordem manual: {job.displayOrder}</p>
                  <p>Publicacao agendada: {job.publishAt ? formatDatePtBR(job.publishAt) : "Nao"}</p>
                  <p>Encerramento agendado: {job.closeAt ? formatDatePtBR(job.closeAt) : "Nao"}</p>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openJobDrawer("edit", job)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600"
                  >
                    <PencilLine className="h-4 w-4 text-brand-500" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void duplicateJob(job.id)}
                    disabled={pendingKey === `duplicate-${job.id}` || isRefreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600 disabled:opacity-70"
                  >
                    <BadgeCheck className="h-4 w-4 text-brand-500" />
                    Duplicar vaga
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div
        className={`fixed inset-0 z-50 transition ${
          drawerKind ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-slate-950/30 transition ${
            drawerKind ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeDrawer}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-[#fbfaf7] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.16)] transition duration-300 sm:p-7 ${
            drawerKind ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-brand-700">
                {drawerKind === "job"
                  ? drawerMode === "create"
                    ? "Nova vaga"
                    : "Editar vaga"
                  : drawerKind === "product"
                    ? drawerMode === "create"
                      ? "Novo produto"
                      : "Editar produto"
                    : drawerMode === "create"
                      ? "Nova categoria"
                      : "Editar categoria"}
              </p>
              <h3 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[0.06em] text-slate-950">
                {drawerKind === "job"
                  ? "Controle de vagas"
                  : drawerKind === "product"
                    ? "Cadastro de produtos"
                    : "Cadastro de categorias"}
              </h3>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-full border border-slate-200 p-2 text-slate-500 hover:border-brand-300 hover:text-brand-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {drawerKind === "job" ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Titulo</label>
                <input
                  className={inputClass}
                  value={jobDraft.title}
                  onChange={(event) =>
                    setJobDraft((current) => ({ ...current, title: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Area</label>
                <input
                  className={inputClass}
                  value={jobDraft.department}
                  onChange={(event) =>
                    setJobDraft((current) => ({ ...current, department: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Local</label>
                <input
                  className={inputClass}
                  value={jobDraft.location}
                  onChange={(event) =>
                    setJobDraft((current) => ({ ...current, location: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Modelo</label>
                <input
                  className={inputClass}
                  value={jobDraft.workModel}
                  onChange={(event) =>
                    setJobDraft((current) => ({ ...current, workModel: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Contrato</label>
                <input
                  className={inputClass}
                  value={jobDraft.contractType}
                  onChange={(event) =>
                    setJobDraft((current) => ({ ...current, contractType: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Ordem manual
                </label>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={jobDraft.displayOrder}
                  onChange={(event) =>
                    setJobDraft((current) => ({
                      ...current,
                      displayOrder: Number(event.target.value || 0),
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
                <select
                  className={inputClass}
                  value={jobDraft.status}
                  onChange={(event) =>
                    setJobDraft((current) => ({
                      ...current,
                      status: event.target.value as JobDraft["status"],
                    }))
                  }
                >
                  {jobStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Publicar em
                </label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={jobDraft.publishAt}
                  onChange={(event) =>
                    setJobDraft((current) => ({ ...current, publishAt: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Encerrar em
                </label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={jobDraft.closeAt}
                  onChange={(event) =>
                    setJobDraft((current) => ({ ...current, closeAt: event.target.value }))
                  }
                />
              </div>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 md:col-span-2">
                <input
                  type="checkbox"
                  checked={jobDraft.featuredHome}
                  onChange={(event) =>
                    setJobDraft((current) => ({
                      ...current,
                      featuredHome: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-300"
                />
                Destacar vaga na home
              </label>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Resumo</label>
                <textarea
                  className={textareaClass}
                  value={jobDraft.summary}
                  onChange={(event) =>
                    setJobDraft((current) => ({ ...current, summary: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Responsabilidades
                </label>
                <p className="mb-2 text-xs leading-6 text-slate-500">Um item por linha</p>
                <textarea
                  className={textareaClass}
                  value={jobDraft.responsibilities}
                  onChange={(event) =>
                    setJobDraft((current) => ({
                      ...current,
                      responsibilities: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Requisitos
                </label>
                <p className="mb-2 text-xs leading-6 text-slate-500">Um item por linha</p>
                <textarea
                  className={textareaClass}
                  value={jobDraft.requirements}
                  onChange={(event) =>
                    setJobDraft((current) => ({
                      ...current,
                      requirements: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Beneficios
                </label>
                <p className="mb-2 text-xs leading-6 text-slate-500">Um item por linha</p>
                <textarea
                  className={textareaClass}
                  value={jobDraft.benefits}
                  onChange={(event) =>
                    setJobDraft((current) => ({ ...current, benefits: event.target.value }))
                  }
                />
              </div>
            </div>
          ) : null}

          {drawerKind === "product" ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(135deg,#fff8f4,#f3ede6)]">
                  {productDraft.imageUrl ? (
                    <Image
                      src={productDraft.imageUrl}
                      alt={productDraft.imageAlt || productDraft.name || "Produto"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center text-slate-400">
                      <PackageSearch className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => productImageInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600"
                  >
                    <ImageUp className="h-4 w-4 text-brand-500" />
                    Enviar imagem
                  </button>
                  <input
                    ref={productImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void uploadMedia(file, "product");
                        event.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Nome</label>
                <input
                  className={inputClass}
                  value={productDraft.name}
                  onChange={(event) =>
                    setProductDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Categoria</label>
                <select
                  className={inputClass}
                  value={productDraft.categoryId}
                  onChange={(event) =>
                    setProductDraft((current) => ({
                      ...current,
                      categoryId: event.target.value,
                    }))
                  }
                >
                  <option value="">Selecione</option>
                  {dashboard.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Ordem manual
                </label>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={productDraft.displayOrder}
                  onChange={(event) =>
                    setProductDraft((current) => ({
                      ...current,
                      displayOrder: Number(event.target.value || 0),
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Resumo</label>
                <textarea
                  className={textareaClass}
                  value={productDraft.summary}
                  onChange={(event) =>
                    setProductDraft((current) => ({ ...current, summary: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Descricao</label>
                <textarea
                  className={textareaClass}
                  value={productDraft.description}
                  onChange={(event) =>
                    setProductDraft((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Perfil de cliente ideal
                </label>
                <textarea
                  className={textareaClass}
                  value={productDraft.idealFor}
                  onChange={(event) =>
                    setProductDraft((current) => ({ ...current, idealFor: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Aplicacoes comerciais
                </label>
                <p className="mb-2 text-xs leading-6 text-slate-500">Um item por linha</p>
                <textarea
                  className={textareaClass}
                  value={productDraft.applications}
                  onChange={(event) =>
                    setProductDraft((current) => ({
                      ...current,
                      applications: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Diferenciais
                </label>
                <p className="mb-2 text-xs leading-6 text-slate-500">Um item por linha</p>
                <textarea
                  className={textareaClass}
                  value={productDraft.differentials}
                  onChange={(event) =>
                    setProductDraft((current) => ({
                      ...current,
                      differentials: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  URL da imagem
                </label>
                <input
                  className={inputClass}
                  value={productDraft.imageUrl}
                  onChange={(event) =>
                    setProductDraft((current) => ({ ...current, imageUrl: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Texto alternativo
                </label>
                <input
                  className={inputClass}
                  value={productDraft.imageAlt}
                  onChange={(event) =>
                    setProductDraft((current) => ({ ...current, imageAlt: event.target.value }))
                  }
                />
              </div>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={productDraft.isFeatured}
                  onChange={(event) =>
                    setProductDraft((current) => ({
                      ...current,
                      isFeatured: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-300"
                />
                Destacar na home
              </label>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={productDraft.isActive}
                  onChange={(event) =>
                    setProductDraft((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-300"
                />
                Produto ativo
              </label>
            </div>
          ) : null}

          {drawerKind === "category" ? (
            <div className="mt-8 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nome</label>
                <input
                  className={inputClass}
                  value={categoryDraft.name}
                  onChange={(event) =>
                    setCategoryDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Descricao</label>
                <textarea
                  className={textareaClass}
                  value={categoryDraft.description}
                  onChange={(event) =>
                    setCategoryDraft((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Ordem manual
                </label>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={categoryDraft.displayOrder}
                  onChange={(event) =>
                    setCategoryDraft((current) => ({
                      ...current,
                      displayOrder: Number(event.target.value || 0),
                    }))
                  }
                />
              </div>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={categoryDraft.isActive}
                  onChange={(event) =>
                    setCategoryDraft((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-300"
                />
                Categoria ativa
              </label>
            </div>
          ) : null}

          {drawerKind ? (
            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {drawerMode === "edit" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (drawerKind === "job") {
                        void deleteJob();
                      } else if (drawerKind === "product") {
                        void deleteProduct();
                      } else {
                        void deleteCategory();
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                ) : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (drawerKind === "job") {
                      void saveJob();
                    } else if (drawerKind === "product") {
                      void saveProduct();
                    } else {
                      void saveCategory();
                    }
                  }}
                  disabled={Boolean(pendingKey) || isRefreshing}
                  className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-400 disabled:opacity-70"
                >
                  {drawerMode === "create" ? "Cadastrar" : "Salvar alteracoes"}
                </button>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
