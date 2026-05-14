import { z } from "zod";

export const updateBlogSchema = z.object({
  body: z.object({
    id: z.string({ message: "Blog ID is required" }).uuid(),
    userId: z.string({ message: "User ID is required" }).uuid(),
    title: z.string().min(5, "Title must be at least 5 characters").optional(),
    content: z.string().min(20, "Content must be at least 20 characters").optional(),
    excerpt: z.string().optional(),
    category: z.array(z.string()).optional(),
  }),
});

export type UpdateBlogInput = z.infer<typeof updateBlogSchema>["body"];