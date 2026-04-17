import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import blogRoutes from "@/routes/blog.routes";

const router = Router();

// Auth Endpoints
router.use("/auth", authRoutes);

// Blog Endpoints
router.use("/blog", blogRoutes);

export default router;