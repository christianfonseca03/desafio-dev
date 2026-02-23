## API - Movimentações Financeiras

### Stack
- NestJS
- Prisma
- PostgreSQL
- Clerk (autenticação)
- Swagger

### Requisitos
- Node.js 18+
- PostgreSQL

### Configuração
Crie um arquivo `.env` em `api/` com:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public
CLERK_SECRET_KEY=seu_secret_key
CLERK_AUTHORIZED_PARTIES=http://localhost:3000
PORT=3001
```

### Banco de dados
As migrations estão em `api/prisma/migrations`.

```
npm install
npx prisma migrate deploy
```

### Executar
```
npm run start:dev
```

Swagger:
```
http://localhost:3001/swagger
```

### Deploy (Render)
Environment Variables:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public
CLERK_SECRET_KEY=seu_secret_key
CLERK_AUTHORIZED_PARTIES=https://seu-app.vercel.app,https://seu-app.vercel.app/
PORT=3001
```

Build Command:
```
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

Start Command:
```
npm run start:prod
```
