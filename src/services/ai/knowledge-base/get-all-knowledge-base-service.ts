import { KnowledgeBaseRepository } from "@/repositories/knowledgebase.repository";

export async function GetAllKnowledgeBaseService() {
  const knowledgeBaseRepository = new KnowledgeBaseRepository();

  try {
    const data = await knowledgeBaseRepository.findAll();
    return {
      code: 200,
      status: "success",
      data,
    };
  } catch (error) {
    console.error("GetAllKnowledgeBaseService Error", error);
    return { code: 500, status: "error", message: "Unable to fetch knowledge base entries" };
  }
}