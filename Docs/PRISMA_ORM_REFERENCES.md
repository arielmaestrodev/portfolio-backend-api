# 💎 Prisma ORM Reference Guide

This document provides a structured overview and essential references for working with Prisma ORM in this project. Use these links and summaries to deepen your understanding of how our data layer is structured.

---

## 🏗️ Core Concepts

### 1. Prisma Models
Models are the foundation of your schema. They represent the entities in your application and map directly to your database tables.

*   **Project Context:** See `User` and `Token` models in `schema.prisma`.
*   **Documentation:** [Prisma Models Guide](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)
*   **Key Features:**
    *   Fields with types (String, DateTime, Enums).
    *   Attributes (e.g., `@id`, `@unique`, `@default`).

### 2. Database Relations
Prisma handles relationships between models seamlessly, supporting various types of cardinality.

*   **Project Context:** Our schema uses a **One-to-Many** relationship between `User` and `Token` (`User` has many `Token`s).
*   **Documentation:** [Relations in Prisma](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)
*   **Types Covered:**
    *   One-to-one (1:1)
    *   One-to-many (1:n)
    *   Many-to-many (m:n)

### 3. Database Mapping
Mapping allows you to decouple your application's field names from the actual database column names.

*   **Project Context:** We use `@map("email_verified")` to map the `emailVerified` CamelCase property in TypeScript to a snake_case column in PostgreSQL.
*   **Documentation:** [Database Mapping](https://www.prisma.io/docs/orm/prisma-schema/data-model/database-mapping)

### 4. Database Indexing
Indexes are critical for performance, especially as your data grows. They speed up queries on frequently searched or joined columns.

*   **Project Context:** We use `@@index([userId, type])` in the `Token` model to optimize token lookups.
*   **Documentation:** [Indexes & Constraints](https://www.prisma.io/docs/orm/prisma-schema/data-model/database-mapping#indexes)

---

## 🛠️ Quick Commands

| Task | Command |
| :--- | :--- |
| **Generate Client** | `npx prisma generate` |
| **Create Migration** | `npx prisma migrate dev --name <name>` |
| **Prisma Studio** (UI) | `npx prisma studio` |
| **Reset Database** | `npx prisma migrate reset` |

---

## 📚 Official Resources
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API Reference](https://www.prisma.io/docs/orm/prisma-client/queries)
- [Schema Reference](https://www.prisma.io/docs/orm/reference/prisma-schema-reference)
