# 🚀 Portfolio Backend API

A production-ready, highly secure REST API built with **Node.js**, **Express**, and **TypeScript**. This project features a robust authentication system, database-backed token management, and strict data validation.

## ✨ Core Features
- **Modern Authentication**: Signup, Login, and secure Token Rotation.
- **Email Verification**: Built-in verification flow via Nodemailer with HTML templates.
- **Stateless Security**: JWT-based access tokens with strict `type` checks.
- **Database Tracking**: Refresh tokens are tracked in PostgreSQL for revocation and security audits.
- **Strict Validation**: All endpoints protected by **Zod** schema validation.
- **Premium DX**: Path aliases (`@/`), singleton Prisma client, and centralized config management.

## 🛠️ Technologies Used
- **Runtime**: Node.js (v20+)
- **Language**: TypeScript
- **Framework**: Express 5.x
- **ORM**: Prisma (PostgreSQL)
- **Validation**: Zod
- **Auth**: JSON Web Tokens (JWT)
- **Execution**: `tsx` (High-performance TS runner)
- **Deployment Build**: `tsc-alias` (For path shortcut resolution)

## 📁 Project Structure
```text
src/
├── config/         # App configuration & environment logic
├── controllers/    # Request handlers (Parsing & Response)
├── generated/      # Auto-generated Prisma Client
├── lib/            # Shared libraries (JWT, Prisma Singleton)
├── middlewares/    # Custom Express middlewares (Zod Validation)
├── repositories/   # Data Access Layer (Prisma Queries)
├── routes/         # Endpoint definitions
├── schema/         # Zod schemas for request validation
├── services/       # Core Business Logic
├── utils/          # Independent helper functions (Hashing, etc.)
├── app.ts          # App configuration
└── server.ts       # Entry point
```

## ⚙️ Installation & Setup

> [!NOTE]
> For a more detailed, step-by-step walkthrough on how I initialized this project from scratch, please refer to the [Detailed Setup Guide](Docs/1-How-to-start-backend-api-project.md).

## 📡 API Endpoints (Auth)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/v1/signup` | Register a new account |
| `POST` | `/api/auth/v1/login` | Authenticate and receive tokens |
| `GET` | `/api/auth/v1/verify-email` | Verify account via email token |
| `POST` | `/api/auth/v1/refresh-token` | Rotate session tokens |
| `POST` | `/api/auth/v1/resend-email` | Resend verification email |

---

## 🏗️ Build & Production
To compile the project for production:
```bash
npm run build
npm start
```
*Note: The build process uses `tsc-alias` to ensure path shortcuts like `@/` work in the compiled JavaScript output.*