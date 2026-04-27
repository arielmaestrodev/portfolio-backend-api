# 🚀 Portfolio Backend API

A production-ready, enterprise-grade REST API built with **Node.js**, **Express**, and **TypeScript**. This project features a sophisticated AI-powered RAG system, role-based security, and advanced database relationships.

## ✨ Core Features
- **🧠 AI-Powered RAG**: Integrated Google Gemini AI using Retrieval-Augmented Generation (RAG) to answer questions based on your specific Knowledge Base and Blog posts.
- **🛡️ RBAC Security**: Granular Role-Based Access Control (ADMIN, USER) with dedicated middlewares for protected resources.
- **🔐 Modern Auth**: Secure Signup, Login, and automatic Token Rotation with database-backed session tracking.
- **📝 Content Management**: Full CRUD systems for Blogs and Knowledge Base entries, including automated AI indexing.
- **📧 Email Services**: Built-in verification flow and HTML templates via Nodemailer.
- **📐 Semantic Search**: High-performance vector similarity search using PostgreSQL `pgvector`.
- **✅ Strict Validation**: 100% endpoint coverage with **Zod** schema validation.

## 🛠️ Technologies Used
- **AI**: Google Generative AI (Gemini 2.5)
- **Database**: PostgreSQL with `pgvector` (Vector Embeddings)
- **ORM**: Prisma (PostgreSQL)
- **Runtime**: Node.js (v20+) & TypeScript
- **Framework**: Express 5.x
- **Validation**: Zod
- **Auth**: JSON Web Tokens (JWT) & `bcrypt`

## 📁 Project Structure Highlights
```text
src/
├── controllers/    # AI, Blog, and Auth request handlers
├── repositories/   # Data Access Layer (Prisma & Vector SQL)
├── routes/         # RBAC-protected route definitions
├── schema/         # Zod schemas for AI and Auth validation
├── services/       # Core Logic (Gemini API, RAG, Auth flows)
└── ...
```

## 📡 API Endpoints

### 🤖 AI Assistant (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ai/v1/ask` | Chat with Ariel Batoon (RAG + General Dev) |

### 🔑 Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/v1/signup` | Register a new account |
| `POST` | `/api/auth/v1/login` | Authenticate and receive tokens |
| `GET` | `/api/auth/v1/verify-email` | Verify account via email token |
| `POST` | `/api/auth/v1/resend-email-verification` | Resend verification email |
| `POST` | `/api/auth/v1/refresh-token` | Rotate session tokens |
| `POST` | `/api/auth/v1/logout` | Revoke tokens and logout |

### 📝 Blog
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blog/v1/all-posts` | Fetch all blog posts | Public |
| `GET` | `/api/blog/v1/post/:id` | Fetch a single post by ID | Public |
| `POST` | `/api/blog/v1/create-post` | Create and index a new post | Admin |
| `POST` | `/api/blog/v1/update-post` | Update post and re-index vector | Admin |
| `DELETE` | `/api/blog/v1/delete-post/:id` | Delete a blog post | Admin |

### 📚 Knowledge Base (Admin Only)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/kb/v1/all` | Fetch all knowledge base entries |
| `POST` | `/api/kb/v1/create` | Create and index a new knowledge entry |
| `PATCH` | `/api/kb/v1/:id` | Update knowledge and re-index vector |
| `DELETE` | `/api/kb/v1/:id` | Remove an entry from the knowledge base |

## ⚙️ Documentation
For detailed guides on implementation and setup, check the `Docs/` folder:
- [Detailed Setup Guide](Docs/BACKEND_API_START_SETUP.md)
- [Gemini AI Implementation (RAG)](Docs/GEMINI_AI_IMPLEMENTATION.md)

---

## 🏗️ Build & Production
```bash
# 1. Apply migrations & Generate Client
npm run db:migrate
npm run db:generate

# 2. Build for production
npm run build

# 3. Start server
npm start
```