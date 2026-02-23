# Desafio Dev — Movimentações Financeiras

Aplicação full stack para controle de categorias e movimentações financeiras, com autenticação via Clerk.

## Estrutura do repositório
- `ui/`: Frontend (Next.js)
- `api/`: Backend (NestJS + Prisma)

## Stack
- UI: Next.js 16, React 19, Tailwind CSS, Clerk
- API: NestJS, Prisma, PostgreSQL, Clerk, Swagger

## Como rodar localmente

### API
1) Configure o `.env` em `api/`:
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public
CLERK_SECRET_KEY=seu_secret_key
CLERK_AUTHORIZED_PARTIES= http://localhost:3000 PORT=3001


2) Instale dependências e rode migrations:
npm install
npx prisma migrate deploy


3) Suba a API:
npm run start:dev


Swagger:
http://localhost:3001/swagger


### UI
1) Configure o `.env.local` em `ui/`:
NEXT_PUBLIC_API_URL= http://localhost:3001 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=sua_publishable_key
CLERK_SECRET_KEY=seu_secret_key


2) Suba a UI:
npm install
npm run dev


Aplicação:
http://localhost:3000