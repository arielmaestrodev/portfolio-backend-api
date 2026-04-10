import { Router } from "express";
import authRoutes from "@/routes/auth.routes";

const router = Router();

// Auth Endpoints
router.use("/auth", authRoutes);

export default router;