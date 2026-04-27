import { Request, Response } from "express";
import { AskAIService } from "@/services/ai/chat/ask-ai-service";

export class AIController {
  /**
   * Main RAG Chat Endpoint
   */
  public ask = async (req: Request, res: Response) => {
    const { question, history } = req.body;
    const result = await AskAIService(question, history);
    return res.status(result.code).json(result);
  };
}