import { Router } from "express";
import { BlogController } from "@/controllers/blog.controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { Role } from "@/generated/prisma/enums";
import { validateSchema } from "@/middlewares/validate-schema";
import { createBlogSchema, updateBlogSchema } from "@/schema/blog";

const router = Router();
const blogController = new BlogController();
const auth = new AuthMiddleware();

// Public Routes
router.get("/v1/all-posts", blogController.getAllBlogs);
router.get("/v1/post/:id", blogController.getBlog);

// Private Routes (Require Authentication & Admin Role)
router.post("/v1/create-post", auth.execute, permittedRole([Role.ADMIN]), validateSchema(createBlogSchema), blogController.createBlog);
router.post("/v1/update-post", auth.execute, permittedRole([Role.ADMIN]), validateSchema(updateBlogSchema), blogController.updateBlog);
router.delete("/v1/delete-post/:id", auth.execute, permittedRole([Role.ADMIN]), blogController.deleteBlog);

export default router;