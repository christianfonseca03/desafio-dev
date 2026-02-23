## UI - Movimentações Financeiras

### Stack
- Next.js 16
- React 19
- Tailwind CSS
- Clerk (autenticação)

### Requisitos
- Node.js 18+

### Configuração
Crie um arquivo `.env.local` em `ui/` com:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=sua_publishable_key
CLERK_SECRET_KEY=seu_secret_key
```

### Executar
```
npm install
npm run dev
```

Aplicação:
```
http://localhost:3000
```

Observação: a API deve estar rodando para o dashboard funcionar.

### Deploy (Vercel)
- Root Directory: `ui`
- Environment Variables:
  - NEXT_PUBLIC_API_URL=https://sua-api.onrender.com
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
  - CLERK_SECRET_KEY=...
- Build Command / Output Directory: deixe sem override
