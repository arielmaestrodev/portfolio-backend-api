import { prisma } from "@/lib/prisma";

export class UserRepository {
  async findById(id: string) {
    return await prisma.user.findFirst({ 
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true, role: true, emailVerified: true },
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findFirst({ where: { email } });
  }

  async create(data: { name?: string | null; email?: string | null; password?: string | null; emailVerified?: Date | null }) {
    return await prisma.user.create({ 
      data,
      select: { id: true, name: true, email: true, createdAt: true, role: true, emailVerified: true },
    });
  }

  async markEmailVerified(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
      select: { id: true, email: true, emailVerified: true },
    });
  }
}