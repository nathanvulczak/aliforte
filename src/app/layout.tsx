import type { Metadata } from "next";
import { Manrope, Rajdhani } from "next/font/google";
import "./globals.css";

import { company } from "@/lib/company";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aliforte.vercel.app"),
  title: {
    default: `${company.name} | Distribuidora de Racoes`,
    template: `%s | ${company.name}`,
  },
  description:
    "Site institucional da Aliforte, distribuidora de raçoes em Guarapuava - PR, com area comercial, produtos, vagas e painel administrativo.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: `${company.name} | Distribuidora de Racoes`,
    description:
      "Parceira comercial para empresas, com operacao estruturada, atendimento consultivo e oportunidades profissionais.",
    url: "https://aliforte.vercel.app",
    siteName: company.name,
    locale: "pt_BR",
    type: "website",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${rajdhani.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
