import { formatPhoneBR } from "@/lib/formatters";

export const company = {
  name: "Aliforte",
  tagline:
    "Distribuicao B2B de racoes com foco em abastecimento recorrente, atendimento proximo e relacionamento comercial.",
  foundedYear: 2015,
  address: "R. Ver. Ailton Jaskulski, 159 - Vila Bela, Guarapuava - PR, 85025-080",
  phoneRaw: "42999442646",
  phoneDisplay: formatPhoneBR("42999442646"),
  email: "contato.aliforte@proton.me",
  city: "Guarapuava - PR",
  region: "Centro-Sul do Parana",
  mapUrl: "https://maps.app.goo.gl/cumQuuZRDCjCDj8P6",
  mapEmbedUrl:
    "https://www.google.com/maps?q=R.+Ver.+Ailton+Jaskulski,+159+-+Vila+Bela,+Guarapuava+-+PR,+85025-080&output=embed",
  storagePublicBase: "https://ljnrwjcyjrpeimtvkjqm.supabase.co/storage/v1/object/public",
};

export const navigation = [
  { label: "Empresa", href: "/#empresa" },
  { label: "Produtos", href: "/produtos" },
  { label: "Quem Atendemos", href: "/#quem-atendemos" },
  { label: "Vagas", href: "/trabalhe-conosco" },
  { label: "Contato", href: "/contato" },
  { label: "Admin", href: "/admin" },
];
