# CRM

Sistema de gestão de relacionamento com clientes (CRM) desenvolvido como monorepo, com aplicativo mobile para iOS/Android, painel web e API REST.

---

## Visão Geral

Plataforma CRM voltada para gestão de clientes (pessoas físicas e jurídicas), negociações comerciais e acompanhamento de faturamento. Arquitetura moderna com código compartilhado entre todas as plataformas.

---

## Tecnologias

### Monorepo
- **Turborepo** — orquestração de builds e tasks
- **pnpm workspaces** — gerenciamento de pacotes

### Mobile
- **Expo / React Native** — aplicativo iOS e Android
- **Expo Router** — navegação baseada em arquivos
- **Supabase** — banco de dados, autenticação e API em tempo real

### Web
- **Next.js 15** (App Router) — painel administrativo

### API *(em desenvolvimento)*
- **Rust** (Axum) — API REST de alta performance
- **PostgreSQL** via Docker
- **SQLx** — queries com verificação em tempo de compilação
- **JWT** — autenticação stateless

### Packages Compartilhados
- `@crm/types` — interfaces TypeScript usadas em todas as plataformas
- `@crm/supabase` — cliente Supabase + funções CRUD
- `@crm/utils` — validação e formatação de CPF/CNPJ

---

## Estrutura do Projeto

```
CRM/
├── apps/
│   ├── mobile/          # Expo / React Native
│   ├── web/             # Next.js App Router
│   └── api/             # API Rust (em desenvolvimento)
├── packages/
│   ├── types/           # @crm/types
│   ├── supabase/        # @crm/supabase
│   └── utils/           # @crm/utils
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Funcionalidades

### Implementadas
- **Autenticação** — login com e-mail e senha via Supabase Auth
- **Dashboard** — resumo de clientes, negociações por status e valor total com gráfico
- **Negociações** — cadastro e listagem com status (Em negociação / Ganho / Perdido / Vencido)
- **Tema escuro** — suporte automático ao dark mode do sistema

### Em desenvolvimento
- **Clientes** — cadastro, listagem e detalhes (PF e PJ com validação CPF/CNPJ)
- **API Rust** — backend próprio com Docker e PostgreSQL
- **Painel Web** — interface administrativa

---

## Banco de Dados

Modelagem PostgreSQL com quatro tabelas principais:

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Perfis dos usuários autenticados |
| `clientes` | Pessoas físicas (CPF) e jurídicas (CNPJ) |
| `enderecos` | Endereços vinculados a clientes |
| `negociacoes` | Oportunidades comerciais com valor e status |

Row Level Security (RLS) habilitado em todas as tabelas.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 12+
- [Expo Go](https://expo.dev/go) (para desenvolvimento mobile)
- Conta no [Supabase](https://supabase.com/)

---

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd CRM

# Instale as dependências
pnpm install
```

### Variáveis de Ambiente

Crie os arquivos `.env.local` com suas credenciais do Supabase:

**`apps/mobile/.env.local`**
```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

---

## Como Rodar

```bash
# Rodar todos os apps em paralelo
pnpm dev

# Rodar apenas o mobile
cd apps/mobile
npx expo start

# Rodar apenas o web
cd apps/web
pnpm dev
```

---

## Autor

**GZN**

---

## Licença

Distribuído sob a licença [MIT](LICENSE). Você pode usar, copiar, modificar e distribuir este código livremente, desde que mantenha o aviso de copyright.
