# 🛠️ How to Start a Portfolio Backend API Project

This guide provides a comprehensive, step-by-step walkthrough for initializing this modern, secure Node.js/Express.js backend.

## 📌 Step 1: Initialize the Project
Start by creating a new directory and initializing the Node.js environment.
```bash
mkdir portfolio-backend-api
cd portfolio-backend-api
npm init -y
```

## 📦 Step 2: Install Core Dependencies
We use a modern stack focused on type safety and security.

### Runtime Dependencies
```bash
npm install express cors cookie-parser dotenv jsonwebtoken nodemailer zod pg @prisma/client @prisma/adapter-pg
```

### Development Dependencies
```bash
npm install -D typescript tsx tsc-alias prisma @types/node @types/express @types/cors @types/cookie-parser @types/jsonwebtoken @types/nodemailer @types/pg
```

---

## ⚙️ Step 3: TypeScript Configuration
We use `NodeNext` and `bundler` resolution to support the cleanest import style without sacrificing Node.js compatibility.

1. Create the config: `npx tsc --init`
2. Update `tsconfig.json` with these settings:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2023"],
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "noImplicitAny": true,
    "allowJs": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 📜 Step 4: Finalize `package.json`
Enable **ES Modules** and set up our high-performance scripts.

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc && tsc-alias",
    "start": "node ./dist/server.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev"
  }
}
```

---

## 📁 Step 5: Directory Structure
Create these folders to maintain a clean, modular architecture.

```text
src/
├── config/         # App configuration & environment logic
├── controllers/    # Request handlers (Parsing & Response)
├── lib/            # Shared libraries (Prisma Singleton, Mailer)
├── middlewares/    # Middleware logic (Validation, Auth, Errors)
├── repositories/   # Data Access Layer (Prisma Queries)
├── routes/         # Endpoint definitions
├── schema/         # Zod validation schemas
├── services/       # Core Business Logic
├── utils/          # Independent helper functions (JWT, Password)
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

---

## 🗄️ Step 6: Setup Prisma ORM
We use Prisma with a custom output location to keep our `src` folder as the single source of truth.

1. **Initialize Prisma**: 
   ```bash
   npx prisma init --datasource-provider postgresql
   ```

2. **Configure `schema.prisma`**:
   Update the generator to output inside `src`:
   ```prisma
   generator client {
     provider = "prisma-client-js"
     output   = "../src/generated/prisma"
   }
   ```

3. **Database Client (`src/lib/prisma.ts`)**:
   ```typescript
      import "dotenv/config";
      import { PrismaPg } from "@prisma/adapter-pg";
      import { PrismaClient } from "@/generated/prisma/client";

      const connectionString = `${process.env.DATABASE_URL}`;

      const adapter = new PrismaPg({ connectionString });
      const prisma = new PrismaClient({ adapter });

      export { prisma };
   ```

---

## 🛡️ Step 7: Environment & Security
1. **`.env` Management**:
   Never push your `.env` to Git. Always create a `.env.example` as a template for other developers.
   
2. **`.gitignore`**:
   Ensure `node_modules`, `dist`, `.env`, and `src/generated/` are ignored.

---

## 🚀 Step 8: Deployment Ready
Before pushing to production, always ensure `tsc-alias` is used in your build script to resolve the `@/` path shortcuts in the compiled JavaScript.
```bash
npm run build
```
