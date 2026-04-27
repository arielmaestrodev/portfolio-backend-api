import { KnowledgeBaseRepository } from "@/repositories/knowledgebase.repository";

export async function DeleteKnowledgeBaseService(id: string) {
  const knowledgeBaseRepository = new KnowledgeBaseRepository();

  try {
    await knowledgeBaseRepository.delete(id);
    return {
      code: 200,
      status: "success",
      message: "Knowledge base entry deleted successfully",
    };
  } catch (error) {
    console.error("DeleteKnowledgeBaseService Error", error);
    return { code: 500, status: "error", message: "Unable to delete knowledge base entry" };
  }
}