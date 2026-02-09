# PersonaLab

`PersonaLab` é um projeto acadêmico desenvolvido para apoiar os exercícios da disciplina **Interface e Jornada do Usuário**.

O objetivo do web app é facilitar a criação, análise e exportação de personas de UX para uso nas atividades da matéria.

## Autor

Feito por **Patrick Imbrizi**  
GitHub: https://github.com/Patrick-Imbrizi/

## O que o app entrega

- Formulário completo para construção de persona UX:
  dados demográficos, contexto, objetivos, dores, motivações, comportamento, jornada, personalidade, acessibilidade, critérios de decisão, métricas e oportunidades.
- Autenticação por usuário com Supabase.
- CRUD completo de personas.
- Regra de edição por propriedade:
  apenas o autor pode editar/excluir.
- Ao tentar editar uma persona de outro usuário, o sistema gera uma cópia para edição.
- Biblioteca com personas públicas da comunidade.
- Múltiplos outputs:
  PDF executivo, PDF detalhado, JSON, Markdown, visualização web e modo impressão.
- Download individual por formato e opção de baixar tudo.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (Auth + Postgres + RLS)
- react-hook-form + zod
- jsPDF

## Como rodar localmente

1. Instale as dependências:

```bash
yarn install
```

2. Configure variáveis de ambiente:

```bash
cp .env.example .env.local
```

3. Preencha o arquivo `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

4. No Supabase, execute o SQL em `supabase/schema.sql`.
5. No Supabase, habilite `Email/Password` em `Authentication > Providers`.
6. Rode o projeto:

```bash
yarn dev
```

7. Acesse `http://localhost:3000`.

## Scripts

- `yarn dev`: ambiente de desenvolvimento
- `yarn lint`: análise de lint
- `yarn test`: execução de testes
- `yarn test:watch`: testes em modo watch
- `yarn build`: build de produção

## Deploy (Vercel)

1. Conecte o repositório na Vercel.
2. Configure as variáveis:
   `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
3. Faça o deploy.

## Observações

- Interface em `pt-BR` com estrutura preparada para expansão de idioma.
- Tema claro/escuro com paleta preto, branco e cinza.
- Layout responsivo para mobile usando `grid` e `flex`.
