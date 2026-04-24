export type JobStatus = "draft" | "published" | "closed";
export type LeadStatus =
  | "novo"
  | "em_contato"
  | "qualificado"
  | "proposta"
  | "encerrado";
export type LeadPriority = "baixa" | "media" | "alta";
export type ApplicationStatus =
  | "novo"
  | "triagem"
  | "entrevista"
  | "aprovado"
  | "encerrado";

export interface SiteMetric {
  value: string;
  label: string;
}

export interface TitledBodyItem {
  title: string;
  body: string;
}

export interface AudienceItem {
  title: string;
  body: string;
}

export interface SiteSectionOrderItem {
  id:
    | "credibilidade"
    | "produtos"
    | "atendimento"
    | "publico"
    | "compromisso"
    | "contato"
    | "talentos";
  label: string;
}

export interface SiteSettings {
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
  heroStats: SiteMetric[];
  differentiators: TitledBodyItem[];
  serviceSteps: TitledBodyItem[];
  audienceItems: AudienceItem[];
  commitmentItems: string[];
  homeSectionOrder: SiteSectionOrderItem[];
  featuredBrands: string[];
  trustSignals: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ProductItem {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  idealFor: string;
  applications: string[];
  differentials: string[];
  imageUrl?: string | null;
  imageAlt?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface SiteJob {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  workModel: string;
  contractType: string;
  status: JobStatus;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  featuredHome: boolean;
  displayOrder: number;
  publishAt?: string | null;
  closeAt?: string | null;
  createdAt: string;
  publishedAt?: string | null;
  closedAt?: string | null;
}

export interface CompanyLeadRecord {
  id: string;
  companyName: string;
  contactName: string;
  cnpj: string;
  city: string;
  phone: string;
  email: string;
  message?: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  notes?: string | null;
  createdAt: string;
}

export interface JobApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  linkedin?: string | null;
  message?: string | null;
  resumePath: string;
  status: ApplicationStatus;
  notes?: string | null;
  isFavorite: boolean;
  createdAt: string;
}

export interface AdminDashboardData {
  isSupabaseConfigured: boolean;
  userEmail: string | null;
  settings: SiteSettings;
  categories: ProductCategory[];
  products: ProductItem[];
  jobs: SiteJob[];
  leads: CompanyLeadRecord[];
  applications: JobApplicationRecord[];
}
