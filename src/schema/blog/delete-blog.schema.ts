import { z } from "zod";

export const deleteBlogSchema = z.object({
  body: z.object({
    id: z.string({ message: "ID is required" }),
    userId: z.string({ message: "User ID is required" }),
  }),
});

export type DeleteBlogInput = z.infer<typeof deleteBlogSchema>["body"];