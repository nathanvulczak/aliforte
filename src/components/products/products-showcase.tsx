"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronRight, Package2 } from "lucide-react";

import type { ProductCategory, ProductItem } from "@/lib/types";

export function ProductsShowcase({
  categories,
  products,
}: {
  categories: ProductCategory[];
  products: ProductItem[];
}) {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? "");
  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.categoryId === activeCategoryId);
  }, [products, activeCategoryId]);

  const activeCategory = categories.find((item) => item.id === activeCategoryId);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
      <div className="soft-card rounded-[2rem] p-4 sm:p-5">
        <div className="grid gap-3">
          {categories.map((category) => {
            const active = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${
                  active
                    ? "border-brand-200 bg-brand-50 shadow-[0_16px_34px_rgba(239,55,45,0.10)]"
                    : "border-slate-200 bg-white hover:border-brand-200"
                }`}
              >
                <p className="font-semibold text-slate-900">{category.name}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="soft-card rounded-[2rem] px-5 py-6 sm:px-6">
          <p className="text-sm uppercase tracking-[0.24em] text-brand-700">
            {activeCategory?.name ?? "Linhas"}
          </p>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">
            {activeCategory?.description ??
              "Selecione uma categoria para conhecer melhor as linhas e aplicacoes comerciais."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group soft-card overflow-hidden rounded-[2rem] transition hover:-translate-y-1"
            >
              <div className="relative">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.imageAlt ?? product.name}
                    width={900}
                    height={680}
                    className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-[linear-gradient(135deg,#fff7f5,#f6efe6)]">
                    <Package2 className="h-10 w-10 text-brand-500" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/35 to-transparent" />
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{product.summary}</p>
                  </div>
                  {product.isFeatured ? (
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs uppercase tracking-[0.22em] text-brand-700">
                      Destaque
                    </span>
                  ) : null}
                </div>

                <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Perfil ideal</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{product.idealFor}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Aplicacoes</p>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                      {product.applications.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <ChevronRight className="mt-1 h-4 w-4 text-brand-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Diferenciais</p>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                      {product.differentials.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <ChevronRight className="mt-1 h-4 w-4 text-brand-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
