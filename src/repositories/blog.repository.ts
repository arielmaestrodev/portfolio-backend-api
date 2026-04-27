import { prisma } from "@/lib/prisma";

export interface BlogData {
  title: string;
  content: string;
  excerpt: string;
  category: string[];
  slug: string;
  authorId: string;
  embedding?: string; // Vector as string "[v1,v2,...]"
}

export class BlogRepository {
  async create(data: BlogData) {
    if (data.embedding) {
      return await prisma.$executeRawUnsafe(
        `INSERT INTO "Blog" (id, title, content, excerpt, category, slug, "authorId", embedding, "createdAt", "updatedAt") 
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7::vector, NOW(), NOW())`,
        data.title,
        data.content,
        data.excerpt,
        data.category,
        data.slug,
        data.authorId,
        data.embedding
      );
    }
    return await prisma.blog.create({ data });
  }

  async update(id: string, data: Partial<BlogData>) {
    if (data.embedding) {
      return await prisma.$executeRawUnsafe(
        `UPDATE "Blog" SET 
          title = COALESCE($1, title), 
          content = COALESCE($2, content), 
          excerpt = COALESCE($3, excerpt), 
          category = COALESCE($4, category), 
          slug = COALESCE($5, slug), 
          embedding = $6::vector, 
          "updatedAt" = NOW() 
         WHERE id = $7`,
        data.title || null,
        data.content || null,
        data.excerpt || null,
        data.category || null,
        data.slug || null,
        data.embedding,
        id
      );
    }
    return await prisma.blog.update({
      where: { id },
      data
    });
  }

  async searchSimilar(vector: string, limit: number = 5) {
    return await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, title, slug, excerpt, content, category, 
       (embedding <=> $1::vector) as distance
       FROM "Blog"
       ORDER BY distance ASC
       LIMIT $2`,
      vector,
      limit
    );
  }

  async delete(id: string) {
    return await prisma.blog.delete({ where: { id } });
  }

  async findById(id: string) {
    return await prisma.blog.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, email: true } } }
    });
  }

  async findBySlug(slug: string) {
    return await prisma.blog.findUnique({
      where: { slug },
      include: { author: { select: { id: true, name: true, email: true } } }
    });
  }

  async findAll() {
    return await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, name: true, email: true } } }
    });
  }
}