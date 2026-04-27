import { Request, Response } from "express";
import {  CreateKnowledgeBaseService, UpdateKnowledgeBaseService, DeleteKnowledgeBaseService, GetAllKnowledgeBaseService } from "@/services/ai/knowledge-base";

export class KnowledgeBaseController {
  // Create Knowledge
  public createKnowledge = async (req: Request, res: Response) => {
    const data = req.body;
    const result = await CreateKnowledgeBaseService(data);
    return res.status(result.code).json(result);
  };

  // Get All Knowledge
  public getAllKnowledge = async (req: Request, res: Response) => {
    const result = await GetAllKnowledgeBaseService();
    return res.status(result.code).json(result);
  };

  // Update Knowledge
  public updateKnowledge = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = { ...req.body, id };
    const result = await UpdateKnowledgeBaseService(data);
    return res.status(result.code).json(result);
  };

  // Delete Knowledge
  public deleteKnowledge = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await DeleteKnowledgeBaseService(id);
    return res.status(result.code).json(result);
  };
}