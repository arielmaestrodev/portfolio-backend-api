# AI Implementation Guide with Google Gemini & RAG

This document provides a deep dive into how we integrated Google Gemini AI into this portfolio backend. It is designed to help students understand the "Why" behind the "How."

---

## ⚙️ Installation & Setup

To get started with this implementation, you need to install the following core packages:

```powershell
# Google Gemini AI SDK
npm install @google/generative-ai
```

---

## 🧠 1. The Core Concept: Brain vs. Library

Think of the implementation in two parts:
1.  **The LLM (Gemini):** This is the "Brain." It knows how to speak, write code, and be polite. However, it doesn't know *you* or your specific projects until you tell it.
2.  **The RAG (Vector Database):** This is the "Library." We store your biography, skills, and blog posts here. 

**The Workflow:** When a user asks a question, we go to the **Library** to find the relevant books, then we show those books to the **Brain** so it can give a smart answer based *only* on those books.

---

## 🛠️ 2. The Technical Stack

*   **Model:** `gemini-2.5-flash, gemini-2.5-flash-lite, gemini-2.5-pro` (Fast and powerful).
*   **Embeddings:** `gemini-embedding-2` (Turns text into math).
*   **Database:** PostgreSQL with `pgvector` (Stores the math).
*   **ORM:** Prisma (Manages the database).

---

## 📊 3. Understanding "Embeddings" (The Math)

Computers don't understand words; they understand numbers. 
An **Embedding** is a list of **768 numbers** that represent the "meaning" of a sentence.

*   "I love coding in TypeScript" and "I enjoy developing with TS" will have very similar numbers.
*   "I like eating pizza" will have very different numbers.

### Why 768?
Different AI models use different "dimensions." Google's `gemini-embedding-2` uses **768**. This is why our database column must be exactly `vector(768)`.

---

## 🚀 4. Implementation Step-by-Step

### Step 1: Enabling the Database
Prisma cannot create the `vector` type by itself. We must tell PostgreSQL to enable the extension manually in the migration file:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Step 2: The Search Logic (Cosine Distance)
We use a special operator `<=>` in SQL. 
*   **0.0 distance** = The meanings are identical.
*   **1.0 distance** = The meanings are completely unrelated.
We sort by the lowest distance to find the best match.

### Step 3: The System Instruction (Persona)
We don't just ask the AI to "answer." We give it a **Role**. 
In `gemini-service.ts`, we tell the AI:
> "You are Ariel Batoon. Speak in the first person. Use the provided library for facts. If asked about non-tech topics (like movies or food), politely decline."

---

## 📋 5. How to Test (For Students)

1.  **Populate the Library:** Use the `POST /v1/knowledge` endpoint to add facts about yourself.
2.  **Ask a Question:** Use the `POST /v1/ask` endpoint.
3.  **Check the "Sources":** The API returns a `sources` array. This shows you exactly which "books" from the library the AI used to answer the question.

---

## 💡 Best Practices for Scaling
*   **Chunking:** For long blog posts, we don't send the whole post. We split it into smaller pieces (chunks) so the AI doesn't get overwhelmed (and to save money/tokens!).
*   **History Limits:** We only send the last 6 messages of a conversation. Sending a 100-page chat history would be too slow and expensive.

---

## 🔗 References
*   [Gemini API Embeddings Documentation](https://ai.google.dev/gemini-api/docs/embeddings)
*   [Gemini API Models Documentation](https://ai.google.dev/gemini-api/docs/models)

---
*Happy Coding! Use this as a reference for your own AI-powered projects.*