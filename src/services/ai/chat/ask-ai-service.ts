import { KnowledgeBaseRepository } from "@/repositories/knowledgebase.repository";
import { BlogRepository } from "@/repositories/blog.repository";
import { generateEmbedding, generateChatResponse } from "../core/gemini-service";
import { Content } from "@google/generative-ai";

export async function AskAIService(question: string, history: Content[] = []) {
  const knowledgeBaseRepository = new KnowledgeBaseRepository();
  const blogRepository = new BlogRepository();

  try {
    // 1. Generate embedding for the question
    const embedding = await generateEmbedding(question);
    const vectorStr = `[${embedding.join(",")}]`;

    // 2. Search for similar context in both repositories
    const [relevantKB, relevantBlogs] = await Promise.all([
      knowledgeBaseRepository.searchSimilar(vectorStr, 3),
      blogRepository.searchSimilar(vectorStr, 3)
    ]);

    // 3. Format combined context
    let context = "";
    
    if (relevantKB.length > 0) {
      context += "Knowledge Base Info:\n" + relevantKB.map((k: any) => `Q: ${k.question}\nA: ${k.answer}`).join("\n\n") + "\n\n";
    }
    
    if (relevantBlogs.length > 0) {
      context += "Relevant Blog Posts:\n" + relevantBlogs.map((b: any) => `Title: ${b.title}\nContent: ${b.content}`).join("\n\n");
    }

    if (!context) {
      context = "No specific knowledge or blogs found in the database.";
    }

    // 4. Generate AI response
    const answer = await generateChatResponse(question, context, history);

    return {
      code: 200,
      status: "success",
      data: {
        answer,
        sources: [
          ...relevantKB.map((k: any) => ({ type: "kb", title: k.question, distance: k.distance })),
          ...relevantBlogs.map((b: any) => ({ type: "blog", title: b.title, distance: b.distance }))
        ]
      },
    };
  } catch (error) {
    console.error("AskAIService Error", error);
    return { code: 500, status: "error", message: "AI assistant is currently unavailable" };
  }
}