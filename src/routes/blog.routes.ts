import { Router } from "express";
import { BlogController } from "@/controllers/blog.controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { createBlogSchema, updateBlogSchema } from "@/schema/blog";

const router = Router();
const blogController = new BlogController();
const auth = new AuthMiddleware();

// Public Routes
router.get("/v1/all-posts", blogController.getAllBlogs);
router.get("/v1/post/:id", blogController.getBlog);

// Private Routes (Require Authentication)
router.post("/v1/create-post", auth.execute, validateSchema(createBlogSchema), blogController.createBlog);
router.post("/v1/update-post", auth.execute, validateSchema(updateBlogSchema), blogController.updateBlog);
router.delete("/v1/delete-post/:id", auth.execute, blogController.deleteBlog);

export default router;