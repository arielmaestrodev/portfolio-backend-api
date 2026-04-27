import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import blogRoutes from "@/routes/blog.routes";
import knowledgeBaseRoutes from "@/routes/knowledgebase.routes";
import aiRoutes from "@/routes/ai.routes";

const router = Router();

// Auth Endpoints
router.use("/auth", authRoutes);

// Blog Endpoints
router.use("/blog", blogRoutes);

// Knowledge Base Endpoints
router.use("/knowledgebase", knowledgeBaseRoutes);

// AI Endpoints
router.use("/ai", aiRoutes);

export default router;