import { Router } from "express";
import { KnowledgeBaseController } from "@/controllers/knowledgebase.controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { Role } from "@/generated/prisma/enums";
import { validateSchema } from "@/middlewares/validate-schema";
import { createKnowledgeSchema, updateKnowledgeSchema } from "@/schema/ai/knowledge";

const router = Router();
const knowledgeBaseController = new KnowledgeBaseController();
const auth = new AuthMiddleware();

// Private Routes (Admin Only)
router.get("/v1/all", auth.execute, permittedRole([Role.ADMIN]), knowledgeBaseController.getAllKnowledge);
router.post("/v1/create", auth.execute, permittedRole([Role.ADMIN]), validateSchema(createKnowledgeSchema), knowledgeBaseController.createKnowledge);
router.patch("/v1/:id", auth.execute, permittedRole([Role.ADMIN]), validateSchema(updateKnowledgeSchema), knowledgeBaseController.updateKnowledge);
router.delete("/v1/:id", auth.execute, permittedRole([Role.ADMIN]), knowledgeBaseController.deleteKnowledge);

export default router;