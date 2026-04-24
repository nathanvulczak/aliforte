# Aliforte

Site institucional da Aliforte com:

- home B2B focada em posicionamento de marca
- cadastro comercial para empresas interessadas
- portal `Trabalhe Conosco` com upload de currículo em PDF
- painel administrativo para login interno, gestão de vagas, currículos e contatos
- integração preparada para Supabase

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

O projeto também aceita `NEXT_PUBLIC_SUPABASE_ANON_KEY` se você quiser usar a chave antiga.

## Setup do Supabase

1. Crie um projeto no Supabase.
2. Rode o SQL de [supabase/schema.sql](./supabase/schema.sql) no SQL Editor.
3. Crie um usuário administrador no Supabase Auth com e-mail e senha.
4. Preencha o `.env.local`.
5. Rode `npm run dev`.

## Deploy

### Vercel

1. Suba o projeto para um repositório Git.
2. Importe o repositório na Vercel.
3. Adicione as mesmas variáveis do `.env.local`.
4. Faça o deploy.

### Netlify

Também funciona, mas para Next.js com App Router a Vercel costuma ser a opção mais direta.

## Estrutura principal

- `src/app` páginas e rotas
- `src/components` componentes de interface e formulários
- `src/lib` dados, validações, formatação e integração Supabase
- `supabase/schema.sql` banco, RLS e storage
