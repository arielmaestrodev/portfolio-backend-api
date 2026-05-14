import { Router } from "express";
import { BlogController } from "@/controllers/blog.controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { Role } from "@/generated/prisma/enums";
import { validateSchema } from "@/middlewares/validate-schema";
import { createBlogSchema, updateBlogSchema } from "@/schema/blog";
import { createCommentSchema, deleteCommentSchema, getCommentsByBlogSchema } from "@/schema/blog/comment.schema";

const router = Router();
const blogController = new BlogController();
const authMiddleware = new AuthMiddleware();

// Public Routes
router.get("/v1/all-posts", blogController.getAllBlogs);
router.get("/v1/post/:id", blogController.getBlog);
router.get("/v1/comments/:blogId", validateSchema(getCommentsByBlogSchema), blogController.getComments);

// Private Routes (Require Authentication & Admin Role)
router.post("/v1/create-post", authMiddleware.execute, permittedRole([Role.ADMIN]), validateSchema(createBlogSchema), blogController.createBlog);
router.post("/v1/update-post", authMiddleware.execute, permittedRole([Role.ADMIN]), validateSchema(updateBlogSchema), blogController.updateBlog);
router.post("/v1/delete-post", authMiddleware.execute, permittedRole([Role.ADMIN]), blogController.deleteBlog);

// Private Routes (Require Authentication)
router.post("/v1/comments", authMiddleware.execute, validateSchema(createCommentSchema), blogController.postComment);
router.delete("/v1/comments/:id", authMiddleware.execute, validateSchema(deleteCommentSchema), blogController.deleteComment);

export default router;