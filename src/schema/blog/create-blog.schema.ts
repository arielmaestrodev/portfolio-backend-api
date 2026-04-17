import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string({ message: "Title is required" }).min(5, "Title must be at least 5 characters"),
    content: z.string({ message: "Content is required" }).min(20, "Content must be at least 20 characters"),
    excerpt: z.string().optional(),
    category: z.array(z.string()).optional(),
  }),
});