import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
    userId: z.string({ message: "User ID is required" }),
    title: z.string({ message: "Title is required" }).min(5, "Title must be at least 5 characters"),
    content: z.string({ message: "Content is required" }).min(20, "Content must be at least 20 characters"),
    excerpt: z.string().optional(),
    category: z.array(z.string()).optional(),
  }),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>["body"];