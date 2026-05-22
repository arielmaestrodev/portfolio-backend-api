import { KnowledgeBaseRepository } from "@/repositories/knowledgebase.repository";
import { generateEmbedding } from "@/services/ai/core/gemini-service";

interface UpdateKnowledgeBaseData {
  id: string;
  question?: string;
  answer?: string;
  category?: string;
  tags?: string[];
  metadata?: any;
  isActive?: boolean;
}

export async function UpdateKnowledgeBaseService(data: UpdateKnowledgeBaseData) {
  const knowledgeBaseRepository = new KnowledgeBaseRepository();

  try {
    const existing = await knowledgeBaseRepository.findById(data.id);
    if (!existing) {
      return { code: 404, status: "error", message: "Knowledge base entry not found" };
    }

    let vectorStr = undefined;
    if (data.question !== undefined || data.answer !== undefined) {
      const newQuestion = data.question ?? existing.question ?? "";
      const newAnswer = data.answer ?? existing.answer;
      const embedding = await generateEmbedding(`${newQuestion}\n${newAnswer}`);
      vectorStr = `[${embedding.join(",")}]`;
    }

    await knowledgeBaseRepository.update(data.id, {
      ...data,
      embedding: vectorStr,
    });

    return {
      code: 200,
      status: "success",
      message: "Knowledge base entry updated successfully",
    };
  } catch (error) {
    console.error("UpdateKnowledgeBaseService Error", error);
    return { code: 500, status: "error", message: "Unable to update knowledge base entry" };
  }
}