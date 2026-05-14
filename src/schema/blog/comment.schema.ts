import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
    blogId: z.string().uuid("Invalid Blog ID"),
    userId: z.string().uuid("Invalid User ID"),
  }),
});

export const deleteCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Comment ID"),
  }),
});

export const getCommentsByBlogSchema = z.object({
  params: z.object({
    blogId: z.string().uuid("Invalid Blog ID"),
  }),
});
