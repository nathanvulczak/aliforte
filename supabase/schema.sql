create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.site_settings (
  id integer primary key,
  hero_badge text not null default '',
  hero_title text not null default '',
  hero_description text not null default '',
  hero_primary_label text not null default '',
  hero_primary_href text not null default '',
  hero_secondary_label text not null default '',
  hero_secondary_href text not null default '',
  hero_image_url text not null default '',
  hero_image_alt text not null default '',
  hero_eyebrow text not null default '',
  campaign_label text not null default '',
  campaign_title text not null default '',
  campaign_description text not null default '',
  campaign_href text not null default '',
  campaign_cta_label text not null default '',
  proof_headline text not null default '',
  proof_description text not null default '',
  products_headline text not null default '',
  products_description text not null default '',
  audience_headline text not null default '',
  audience_description text not null default '',
  service_headline text not null default '',
  service_description text not null default '',
  commitment_headline text not null default '',
  commitment_description text not null default '',
  contact_headline text not null default '',
  contact_description text not null default '',
  careers_headline text not null default '',
  careers_description text not null default '',
  hero_stats jsonb not null default '[]'::jsonb,
  differentiators jsonb not null default '[]'::jsonb,
  service_steps jsonb not null default '[]'::jsonb,
  audience_items jsonb not null default '[]'::jsonb,
  commitment_items jsonb not null default '[]'::jsonb,
  home_section_order jsonb not null default '[]'::jsonb,
  featured_brands text[] not null default '{}',
  trust_signals text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.site_settings
  add column if not exists home_section_order jsonb not null default '[]'::jsonb;

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.product_categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  summary text not null,
  description text not null,
  ideal_for text not null,
  applications text[] not null default '{}',
  differentials text[] not null default '{}',
  image_url text,
  image_alt text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  department text not null,
  location text not null,
  work_model text not null,
  contract_type text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'closed')),
  summary text not null,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  benefits text[] not null default '{}',
  featured_home boolean not null default false,
  display_order integer not null default 0,
  publish_at timestamptz,
  close_at timestamptz,
  published_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.jobs add column if not exists featured_home boolean not null default false;
alter table public.jobs add column if not exists display_order integer not null default 0;
alter table public.jobs add column if not exists publish_at timestamptz;
alter table public.jobs add column if not exists close_at timestamptz;

create table if not exists public.company_leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  cnpj text not null,
  city text not null,
  phone text not null,
  email text not null,
  message text,
  status text not null default 'novo' check (status in ('novo', 'em_contato', 'qualificado', 'proposta', 'encerrado')),
  priority text not null default 'media' check (priority in ('baixa', 'media', 'alta')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.company_leads add column if not exists priority text not null default 'media';
alter table public.company_leads add column if not exists notes text;
alter table public.company_leads drop constraint if exists company_leads_priority_check;
alter table public.company_leads add constraint company_leads_priority_check check (priority in ('baixa', 'media', 'alta'));
alter table public.company_leads drop constraint if exists company_leads_status_check;
alter table public.company_leads add constraint company_leads_status_check check (status in ('novo', 'em_contato', 'qualificado', 'proposta', 'encerrado'));

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  linkedin text,
  message text,
  resume_path text not null,
  status text not null default 'novo' check (status in ('novo', 'triagem', 'entrevista', 'aprovado', 'encerrado')),
  notes text,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.job_applications add column if not exists notes text;
alter table public.job_applications add column if not exists is_favorite boolean not null default false;

create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists jobs_display_order_idx on public.jobs (display_order);
create index if not exists company_leads_status_idx on public.company_leads (status);
create index if not exists company_leads_priority_idx on public.company_leads (priority);
create index if not exists job_applications_status_idx on public.job_applications (status);
create index if not exists job_applications_job_id_idx on public.job_applications (job_id);
create index if not exists products_display_order_idx on public.products (display_order);
create index if not exists product_categories_display_order_idx on public.product_categories (display_order);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists product_categories_set_updated_at on public.product_categories;
create trigger product_categories_set_updated_at
before update on public.product_categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

drop trigger if exists company_leads_set_updated_at on public.company_leads;
create trigger company_leads_set_updated_at
before update on public.company_leads
for each row execute function public.set_updated_at();

drop trigger if exists job_applications_set_updated_at on public.job_applications;
create trigger job_applications_set_updated_at
before update on public.job_applications
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.jobs enable row level security;
alter table public.company_leads enable row level security;
alter table public.job_applications enable row level security;

drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "authenticated manage site settings" on public.site_settings;
create policy "authenticated manage site settings"
on public.site_settings
for all
to authenticated
using (true)
with check (true);

drop policy if exists "public read active product categories" on public.product_categories;
create policy "public read active product categories"
on public.product_categories
for select
to anon, authenticated
using (
  is_active = true
  or auth.role() = 'authenticated'
);

drop policy if exists "authenticated manage product categories" on public.product_categories;
create policy "authenticated manage product categories"
on public.product_categories
for all
to authenticated
using (true)
with check (true);

drop policy if exists "public read active products" on public.products;
create policy "public read active products"
on public.products
for select
to anon, authenticated
using (
  is_active = true
  or auth.role() = 'authenticated'
);

drop policy if exists "authenticated manage products" on public.products;
create policy "authenticated manage products"
on public.products
for all
to authenticated
using (true)
with check (true);

drop policy if exists "public read published jobs" on public.jobs;
create policy "public read published jobs"
on public.jobs
for select
to anon, authenticated
using (
  status = 'published'
  or auth.role() = 'authenticated'
);

drop policy if exists "authenticated manage jobs" on public.jobs;
create policy "authenticated manage jobs"
on public.jobs
for all
to authenticated
using (true)
with check (true);

drop policy if exists "public insert company leads" on public.company_leads;
create policy "public insert company leads"
on public.company_leads
for insert
to anon, authenticated
with check (true);

drop policy if exists "authenticated manage company leads" on public.company_leads;
create policy "authenticated manage company leads"
on public.company_leads
for all
to authenticated
using (true)
with check (true);

drop policy if exists "public insert job applications" on public.job_applications;
create policy "public insert job applications"
on public.job_applications
for insert
to anon, authenticated
with check (true);

drop policy if exists "authenticated manage job applications" on public.job_applications;
create policy "authenticated manage job applications"
on public.job_applications
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "authenticated read resumes" on storage.objects;
create policy "authenticated read resumes"
on storage.objects
for select
to authenticated
using (bucket_id = 'resumes');

drop policy if exists "authenticated manage resumes" on storage.objects;
create policy "authenticated manage resumes"
on storage.objects
for all
to authenticated
using (bucket_id = 'resumes')
with check (bucket_id = 'resumes');

drop policy if exists "public read site media" on storage.objects;
create policy "public read site media"
on storage.objects
for select
to public
using (bucket_id = 'site-media');

drop policy if exists "authenticated manage site media" on storage.objects;
create policy "authenticated manage site media"
on storage.objects
for all
to authenticated
using (bucket_id = 'site-media')
with check (bucket_id = 'site-media');
