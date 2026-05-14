import { Router } from "express";
import { KnowledgeBaseController } from "@/controllers/knowledgebase.controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { Role } from "@/generated/prisma/enums";
import { validateSchema } from "@/middlewares/validate-schema";
import { createKnowledgeSchema, updateKnowledgeSchema } from "@/schema/ai/knowledge";

const router = Router();
const knowledgeBaseController = new KnowledgeBaseController();
const authMiddleware = new AuthMiddleware();

// Private Routes (Admin Only)
router.get("/v1/all", authMiddleware.execute, permittedRole([Role.ADMIN]), knowledgeBaseController.getAllKnowledge);
router.post("/v1/create", authMiddleware.execute, permittedRole([Role.ADMIN]), validateSchema(createKnowledgeSchema), knowledgeBaseController.createKnowledge);
router.patch("/v1/:id", authMiddleware.execute, permittedRole([Role.ADMIN]), validateSchema(updateKnowledgeSchema), knowledgeBaseController.updateKnowledge);
router.delete("/v1/:id", authMiddleware.execute, permittedRole([Role.ADMIN]), knowledgeBaseController.deleteKnowledge);

export default router;