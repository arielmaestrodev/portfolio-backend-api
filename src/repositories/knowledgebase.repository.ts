import { prisma } from "@/lib/prisma";

export interface KBData {
  question?: string;
  answer: string;
  category?: string;
  tags?: string[];
  metadata?: any;
  embedding?: string; // Vector as string "[v1,v2,...]"
  isActive?: boolean;
}

export class KnowledgeBaseRepository {
  /**
   * Create knowledge base entry with vector embedding
   */
  async create(data: KBData) {
    return await prisma.$executeRawUnsafe(
      `INSERT INTO "KnowledgeBase" (id, question, answer, category, tags, metadata, embedding, "isActive", "createdAt", "updatedAt") 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6::vector, true, NOW(), NOW())`,
      data.question || null,
      data.answer,
      data.category || null,
      data.tags || [],
      data.metadata || {},
      data.embedding
    );
  }

  /**
   * Update knowledge base entry, optionally updating vector embedding
   */
  async update(id: string, data: Partial<KBData>) {
    if (data.embedding) {
      return await prisma.$executeRawUnsafe(
        `UPDATE "KnowledgeBase" SET 
          question = COALESCE($1, question), 
          answer = COALESCE($2, answer), 
          category = COALESCE($3, category), 
          tags = COALESCE($4, tags), 
          metadata = COALESCE($5, metadata), 
          embedding = $6::vector, 
          "isActive" = COALESCE($7, "isActive"), 
          "updatedAt" = NOW() 
         WHERE id = $8`,
        data.question || null,
        data.answer || null,
        data.category || null,
        data.tags || null,
        data.metadata || null,
        data.embedding,
        data.isActive ?? null,
        id
      );
    } else {
      return await prisma.knowledgeBase.update({
        where: { id },
        data: {
          question: data.question,
          answer: data.answer,
          category: data.category,
          tags: data.tags,
          metadata: data.metadata,
          isActive: data.isActive
        }
      });
    }
  }

  /**
   * Delete knowledge base entry
   */
  async delete(id: string) {
    return await prisma.knowledgeBase.delete({
      where: { id }
    });
  }

  /**
   * Find all entries (excluding embeddings for performance)
   */
  async findAll() {
    return await prisma.knowledgeBase.findMany({
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        tags: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Find entry by ID
   */
  async findById(id: string) {
    return await prisma.knowledgeBase.findUnique({
      where: { id }
    });
  }

  /**
   * Semantic search using cosine similarity
   */
  async searchSimilar(vector: string, limit: number = 5) {
    return await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, question, answer, category, tags, metadata, 
       (embedding <=> $1::vector) as distance
       FROM "KnowledgeBase"
       WHERE "isActive" = true
       ORDER BY distance ASC
       LIMIT $2`,
      vector,
      limit
    );
  }
}
