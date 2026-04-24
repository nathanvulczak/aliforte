import type { Metadata } from "next";

import { ProductsShowcase } from "@/components/products/products-showcase";
import { RevealSection } from "@/components/site/reveal-section";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteShell } from "@/components/site/site-shell";
import { getProductsData, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Conheca as categorias e linhas atendidas pela Aliforte com foco em aplicacao comercial, perfil ideal e diferenciais.",
};

export default async function ProductsPage() {
  const [settings, productsData] = await Promise.all([getSiteSettings(), getProductsData()]);

  return (
    <SiteShell>
      <RevealSection className="mx-auto w-full max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <div className="soft-card rounded-[2.3rem] px-6 py-7">
            <SectionHeading
              eyebrow="Produtos"
              title={settings.productsHeadline}
              description={settings.productsDescription}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {settings.featuredBrands.map((item) => (
              <div key={item} className="soft-card rounded-[1.7rem] px-5 py-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">
                  {item}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Bloco editavel pelo admin para destacar categorias, campanhas ou marcas
                  atendidas quando voce quiser.
                </p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="section-emerge mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <ProductsShowcase categories={productsData.categories} products={productsData.products} />
      </RevealSection>
    </SiteShell>
  );
}
