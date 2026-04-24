import type {
  CompanyLeadRecord,
  JobApplicationRecord,
  ProductCategory,
  ProductItem,
  SiteJob,
  SiteSettings,
} from "@/lib/types";

export const mockSiteSettings: SiteSettings = {
  heroBadge: "Distribuicao empresarial desde 2015",
  heroTitle:
    "A Aliforte conecta abastecimento, mix comercial e atendimento proximo para empresas que vendem racoes com consistencia.",
  heroDescription:
    "Uma distribuidora pensada para revendas, pet shops, agropecuarias e operacoes comerciais que precisam de reposicao organizada, giro e relacionamento confiavel.",
  heroPrimaryLabel: "Solicitar contato comercial",
  heroPrimaryHref: "/contato",
  heroSecondaryLabel: "Ver linhas atendidas",
  heroSecondaryHref: "/produtos",
  heroImageUrl:
    "https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=1400&q=80",
  heroImageAlt: "Estoque organizado para distribuicao de racoes",
  heroEyebrow: "Distribuidora B2B em Guarapuava - PR",
  campaignLabel: "Campanha em destaque",
  campaignTitle: "Estrutura para abastecimento recorrente e relacionamento de longo prazo.",
  campaignDescription:
    "Posicionamento de marca, atencao ao giro e suporte comercial para empresas que precisam vender melhor e repor com seguranca.",
  campaignHref: "/contato",
  campaignCtaLabel: "Quero atendimento comercial",
  proofHeadline: "Credibilidade que precisa ficar evidente no primeiro scroll",
  proofDescription:
    "A nova direcao da home prioriza estrutura, regiao atendida, capacidade de distribuicao e clareza sobre o publico da Aliforte.",
  productsHeadline: "Linhas atendidas com leitura comercial, giro e aplicacao clara",
  productsDescription:
    "A area de produtos existe para ajudar a empresa compradora a entender categoria, perfil ideal e diferenciais sem cair em uma listagem fria.",
  audienceHeadline: "A Aliforte atende empresas que precisam vender com constancia",
  audienceDescription:
    "A mensagem foi reforcada para filtrar melhor o publico e mostrar que o foco esta no atendimento B2B, nao no consumidor final.",
  serviceHeadline: "Como funciona o atendimento",
  serviceDescription:
    "O site passa a mostrar uma jornada de contato mais humana e objetiva, facilitando a decisao de compra de outras empresas.",
  commitmentHeadline: "Compromisso com abastecimento e parceria",
  commitmentDescription:
    "A ideia nao e apenas mostrar produto, mas transmitir seguranca operacional, agilidade e proximidade comercial.",
  contactHeadline: "Uma area comercial preparada para captar empresas interessadas",
  contactDescription:
    "Formulario com dados validados, canal direto e organizacao interna pronta para responder com agilidade.",
  careersHeadline: "Talentos que fortalecem a operacao",
  careersDescription:
    "A area de carreiras continua forte, mas agora encaixada melhor na narrativa da empresa e da estrutura interna.",
  heroStats: [
    { value: "Desde 2015", label: "Atendimento e presenca regional em construcao constante" },
    { value: "Guarapuava", label: "Base operacional para relacionamento e distribuicao" },
    { value: "B2B", label: "Foco em empresas, revendas e operacoes comerciais" },
    { value: "Contato direto", label: "Atendimento comercial agil e sem friccao" },
  ],
  differentiators: [
    {
      title: "Estrutura comercial clara",
      body: "A home deixa evidente quem e a empresa, o que vende e por que faz sentido para o comprador profissional.",
    },
    {
      title: "Distribuicao com leitura de giro",
      body: "Mix, recorrencia e reposicao aparecem como parte da proposta comercial da Aliforte.",
    },
    {
      title: "Marca mais confiavel",
      body: "O site trabalha linguagem, prova de confianca e narrativa para transmitir empresa solida e organizada.",
    },
  ],
  serviceSteps: [
    {
      title: "Cadastro da empresa",
      body: "Lead comercial com dados validados, cidade, CNPJ e contato do responsavel.",
    },
    {
      title: "Analise interna",
      body: "O admin consulta prioridade, observacoes e estagio do relacionamento.",
    },
    {
      title: "Atendimento e recorrencia",
      body: "A relacao sai do primeiro contato e evolui para uma parceria comercial mais previsivel.",
    },
  ],
  audienceItems: [
    {
      title: "Pet shops e lojas especializadas",
      body: "Para operacoes que precisam de mix, exposicao e giro no ponto de venda.",
    },
    {
      title: "Agropecuarias e revendas",
      body: "Para empresas regionais que dependem de reposicao estruturada e atendimento proximo.",
    },
    {
      title: "Supermercados com linha pet",
      body: "Para negocios que precisam ampliar sortimento com seguranca operacional.",
    },
  ],
  commitmentItems: [
    "Agilidade no retorno comercial",
    "Atendimento consultivo e direto",
    "Organizacao para reposicao recorrente",
  ],
  homeSectionOrder: [
    { id: "credibilidade", label: "Credibilidade" },
    { id: "produtos", label: "Produtos" },
    { id: "atendimento", label: "Atendimento" },
    { id: "publico", label: "Publico" },
    { id: "compromisso", label: "Compromisso" },
    { id: "contato", label: "Contato" },
    { id: "talentos", label: "Talentos" },
  ],
  featuredBrands: ["Linhas premium", "Mix economico", "Sortimento regional"],
  trustSignals: [
    "Desde 2015 no mercado",
    "Base em Guarapuava - PR",
    "Atendimento focado em empresas",
  ],
};

export const mockCategories: ProductCategory[] = [
  {
    id: "0db734cf-6607-4c5c-8d95-c48e0f9a7b01",
    name: "Linha de Giro",
    slug: "linha-de-giro",
    description: "Produtos pensados para recorrencia e reposicao constante.",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "7df88a91-e39d-4679-a2de-e2ef6efcb5b0",
    name: "Linha Premium",
    slug: "linha-premium",
    description: "Opcoes de maior valor percebido e ticket mais alto.",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "f91a6f38-b2ff-4f6f-b62d-9f742e3de911",
    name: "Linha Economica",
    slug: "linha-economica",
    description: "Categoria voltada para volume, atratividade e mix acessivel.",
    displayOrder: 3,
    isActive: true,
  },
];

export const mockProducts: ProductItem[] = [
  {
    id: "5ec3c48d-9e87-4f6d-a8d1-419f1fbc5602",
    categoryId: mockCategories[0].id,
    categoryName: mockCategories[0].name,
    name: "Linha Essencial",
    slug: "linha-essencial",
    summary: "Categoria com giro consistente para operacoes de revenda e reposicao rapida.",
    description:
      "Indicada para empresas que precisam manter sortimento ativo, boa rotacao e leitura comercial simples no ponto de venda.",
    idealFor: "Pet shops, supermercados com linha pet e revendas de bairro.",
    applications: [
      "Reposicao recorrente",
      "Exposicao de entrada",
      "Aumento de mix com boa leitura de preco",
    ],
    differentials: [
      "Boa percepcao de giro",
      "Facilidade de reposicao",
      "Equilibrio entre volume e margem",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Sacarias organizadas em estoque",
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "0e994639-f88f-46ad-aea5-b2ac63f99ba0",
    categoryId: mockCategories[1].id,
    categoryName: mockCategories[1].name,
    name: "Linha Performance",
    slug: "linha-performance",
    summary: "Linha de maior valor percebido para fortalecer ticket e credibilidade.",
    description:
      "Pensada para pontos de venda que querem ampliar sortimento e sustentar uma oferta de maior valor para o cliente final.",
    idealFor: "Lojas especializadas e empresas com estrategia de aumento de ticket medio.",
    applications: [
      "Destaque de vitrine",
      "Oferta premium",
      "Composicao de mix diferenciado",
    ],
    differentials: [
      "Maior percepcao de valor",
      "Boa apresentacao comercial",
      "Ajuda a sofisticar o sortimento",
    ],
    imageUrl:
      "https://images.pexels.com/photos/8434685/pexels-photo-8434685.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Racao sendo servida",
    isFeatured: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "6fbd1738-7d29-4617-bd5d-98219a03f18f",
    categoryId: mockCategories[2].id,
    categoryName: mockCategories[2].name,
    name: "Linha Acesso",
    slug: "linha-acesso",
    summary: "Categoria economica para volume, capilaridade e atratividade regional.",
    description:
      "Ajuda a compor sortimento de entrada e responder melhor a publicos com maior sensibilidade de preco.",
    idealFor: "Revendas com foco em volume e pontos comerciais de atendimento amplo.",
    applications: [
      "Volume de saida",
      "Mix acessivel",
      "Complemento de sortimento",
    ],
    differentials: [
      "Atratividade comercial",
      "Bom encaixe em mix economico",
      "Capacidade de volume",
    ],
    imageUrl: null,
    imageAlt: null,
    isFeatured: false,
    isActive: true,
    displayOrder: 3,
  },
];

export const mockJobs: SiteJob[] = [
  {
    id: "747de53f-9463-45af-926f-9b05c3a4b04e",
    title: "Consultor(a) Comercial B2B",
    slug: "consultor-comercial-b2b",
    department: "Comercial",
    location: "Guarapuava - PR",
    workModel: "Presencial",
    contractType: "CLT",
    status: "published",
    summary:
      "Atuacao no relacionamento com empresas, revendas e parceiros comerciais, com foco em expansao e acompanhamento de carteira.",
    responsibilities: [
      "Prospectar novas empresas e revendas.",
      "Acompanhar pedidos, recorrencia e pos-venda.",
      "Atuar em conjunto com operacao e logistica.",
    ],
    requirements: [
      "Experiencia comercial consultiva.",
      "Boa comunicacao e organizacao.",
      "Vivencia com metas e relacionamento B2B.",
    ],
    benefits: [
      "Remuneracao compativel com a funcao.",
      "Ambiente de crescimento e autonomia.",
      "Contato direto com a lideranca comercial.",
    ],
    featuredHome: true,
    displayOrder: 1,
    publishAt: null,
    closeAt: null,
    createdAt: "2026-04-15T10:00:00.000Z",
    publishedAt: "2026-04-16T10:00:00.000Z",
  },
  {
    id: "0dbb394a-7106-4e86-a4cf-cb1bd602f0dd",
    title: "Auxiliar de Expedicao",
    slug: "auxiliar-de-expedicao",
    department: "Operacoes",
    location: "Guarapuava - PR",
    workModel: "Presencial",
    contractType: "CLT",
    status: "published",
    summary:
      "Suporte a conferencia, organizacao e saida de mercadorias, garantindo ritmo operacional e qualidade no atendimento.",
    responsibilities: [
      "Separar volumes e apoiar expedicao.",
      "Conferir produtos e apoiar inventario.",
      "Auxiliar na organizacao do estoque.",
    ],
    requirements: [
      "Ensino medio completo.",
      "Atencao a detalhes e disciplina operacional.",
      "Disponibilidade para rotina presencial.",
    ],
    benefits: [
      "Integracao com equipe operacional.",
      "Treinamento de rotina e processos.",
      "Possibilidade de evolucao interna.",
    ],
    featuredHome: false,
    displayOrder: 2,
    publishAt: null,
    closeAt: null,
    createdAt: "2026-04-12T10:00:00.000Z",
    publishedAt: "2026-04-13T10:00:00.000Z",
  },
  {
    id: "ecbf9157-ebdf-4b71-bcb6-c8ec8698d0e5",
    title: "Assistente Administrativo",
    slug: "assistente-administrativo",
    department: "Administrativo",
    location: "Guarapuava - PR",
    workModel: "Presencial",
    contractType: "CLT",
    status: "draft",
    summary:
      "Apoio a rotinas administrativas, atendimento interno e organizacao documental da operacao.",
    responsibilities: [
      "Organizar documentos e controles internos.",
      "Apoiar rotinas financeiras e administrativas.",
      "Atualizar cadastros e acompanhamento de processos.",
    ],
    requirements: [
      "Organizacao e dominio basico de escritorio digital.",
      "Boa escrita e comunicacao.",
      "Perfil colaborativo.",
    ],
    benefits: [
      "Ambiente estruturado.",
      "Trilha de desenvolvimento interno.",
      "Atuacao proxima da gestao.",
    ],
    featuredHome: false,
    displayOrder: 3,
    publishAt: null,
    closeAt: null,
    createdAt: "2026-04-20T10:00:00.000Z",
  },
];

export const mockLeads: CompanyLeadRecord[] = [
  {
    id: "e4e5b6bb-45c8-4ed3-8c6f-d331e27e2f02",
    companyName: "Agro Vale Revendas",
    contactName: "Marina Souza",
    cnpj: "12987654000133",
    city: "Pinhao - PR",
    phone: "42991001122",
    email: "marina@agrovale.com.br",
    message: "Temos interesse em ampliar nosso portfolio com atendimento recorrente.",
    status: "qualificado",
    priority: "alta",
    notes: "Empresa com potencial para proposta regional.",
    createdAt: "2026-04-21T13:00:00.000Z",
  },
  {
    id: "6f2dd127-2a84-4e5c-a9e7-e2654cb98b42",
    companyName: "Central Pet Atacado",
    contactName: "Joao Ribeiro",
    cnpj: "33123456000180",
    city: "Laranjeiras do Sul - PR",
    phone: "42998552211",
    email: "compras@centralpet.com",
    status: "novo",
    priority: "media",
    notes: null,
    createdAt: "2026-04-22T15:30:00.000Z",
  },
];

export const mockApplications: JobApplicationRecord[] = [
  {
    id: "ab6e7554-5041-4ba9-a6a7-4439ac5eea68",
    jobId: mockJobs[0].id,
    jobTitle: mockJobs[0].title,
    fullName: "Carlos Henrique Lima",
    email: "carlos.henrique@email.com",
    phone: "42991234567",
    city: "Guarapuava - PR",
    linkedin: "https://www.linkedin.com/in/carlos-h-lima",
    message:
      "Tenho experiencia em relacionamento comercial e atendimento a contas empresariais.",
    resumePath: "resumes/exemplo-carlos-henrique.pdf",
    status: "triagem",
    notes: "Bom perfil para entrevista inicial.",
    isFavorite: true,
    createdAt: "2026-04-22T18:00:00.000Z",
  },
  {
    id: "d6c6f958-95fb-4f90-9695-77f0e7d81970",
    jobId: mockJobs[1].id,
    jobTitle: mockJobs[1].title,
    fullName: "Patricia Mendes",
    email: "patricia.mendes@email.com",
    phone: "42999888777",
    city: "Guarapuava - PR",
    resumePath: "resumes/exemplo-patricia-mendes.pdf",
    status: "novo",
    notes: null,
    isFavorite: false,
    createdAt: "2026-04-23T09:10:00.000Z",
  },
];
