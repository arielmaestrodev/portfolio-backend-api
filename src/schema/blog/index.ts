import { z } from "zod";
import { createBlogSchema } from "./create-blog.schema";
import { updateBlogSchema } from "./update-blog.schema";

export * from "./create-blog.schema";
export * from "./update-blog.schema";

export type CreateBlogInput = z.infer<typeof createBlogSchema>["body"];
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>["body"];