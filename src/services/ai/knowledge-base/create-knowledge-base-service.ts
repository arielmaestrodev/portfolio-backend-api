import { KnowledgeBaseRepository } from "@/repositories/knowledgebase.repository";
import { generateEmbedding } from "@/services/ai/core/gemini-service";

interface CreateKnowledgeBaseData {
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  metadata?: any;
}

export async function CreateKnowledgeBaseService(data: CreateKnowledgeBaseData) {
  const knowledgeBaseRepository = new KnowledgeBaseRepository();

  try {
    const embedding = await generateEmbedding(`${data.question}\n${data.answer}`);
    const vectorStr = `[${embedding.join(",")}]`;

    await knowledgeBaseRepository.create({
      ...data,
      embedding: vectorStr,
    });

    return {
      code: 201,
      status: "success",
      message: "Knowledge base entry created successfully",
    };
  } catch (error: any) {
    console.error("CreateKnowledgeBaseService Error", error);

    // Handle duplicate question unique constraint violation (PostgreSQL code 23505)
    if (error.message?.includes("23505") || error.code === "P2002") {
      return { 
        code: 409, 
        status: "error", 
        message: "A knowledge base entry with this question already exists." 
      };
    }

    return { code: 500, status: "error", message: "Unable to create knowledge base entry" };
  }
}