import { Router } from "express";
import { AIController } from "@/controllers/ai.controller";
import { validateSchema } from "@/middlewares/validate-schema";
import { askSchema } from "@/schema/ai/chat.schema";

const router = Router();
const aiController = new AIController();

// Public route for portfolio visitors to ask questions
router.post("/v1/ask", validateSchema(askSchema), aiController.ask);

export default router;