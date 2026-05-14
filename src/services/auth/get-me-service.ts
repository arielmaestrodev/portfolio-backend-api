import { prisma } from "@/lib/prisma";

export const GetMeService = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
      }
    });

    if (!user) {
      return { code: 404, status: "error", message: "User not found" };
    }

    return {
      code: 200,
      status: "success",
      data: { user },
    };
  } catch (error) {
    console.error("GetMeService Error", error);
    return { code: 500, status: "error", message: "Failed to fetch user data" };
  }
};
