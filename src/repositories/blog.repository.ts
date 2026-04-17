import { prisma } from "@/lib/prisma";

export interface BlogData {
  title: string;
  content: string;
  excerpt: string;
  category: string[];
  slug: string;
  authorId: string;
}

export class BlogRepository {
  async create(data: BlogData) {
    // Query
    return await prisma.blog.create({ 
      data,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async update(id: string, data: Partial<BlogData>) {
    // Query
    return await prisma.blog.update({
      where: { id },
      data,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async delete(id: string) {
    // Query
    return await prisma.blog.delete({
      where: { id },
    });
  }

  async findById(id: string) {
    // Query
    return await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async findBySlug(slug: string) {
    // Query
    return await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async findAll() {
    // Query
    return await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }
}