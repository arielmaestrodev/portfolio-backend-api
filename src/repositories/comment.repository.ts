import { prisma } from "@/lib/prisma";

export class CommentRepository {
  public async create(data: { content: string; userId: string; blogId: string }) {
    return await prisma.comment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  public async findByBlogId(blogId: string) {
    return await prisma.comment.findMany({
      where: { blogId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  public async findById(id: string) {
    return await prisma.comment.findUnique({
      where: { id },
      include: {
        blog: {
          select: {
            authorId: true,
          }
        }
      }
    });
  }

  public async delete(id: string) {
    return await prisma.comment.delete({
      where: { id },
    });
  }
}
