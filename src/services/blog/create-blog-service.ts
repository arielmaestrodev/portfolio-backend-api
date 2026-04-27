import { BlogRepository } from "@/repositories/blog.repository";
import { generateEmbedding } from "@/services/ai/core/gemini-service";

interface CreateBlogData {
  title: string;
  content: string;
  excerpt?: string;
  category?: string[];
  authorId: string;
}

export async function CreateBlogService(data: CreateBlogData) {
  const blogRepository = new BlogRepository();

  try {
    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if slug exists
    const existing = await blogRepository.findBySlug(slug);
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    // Generate embedding for RAG
    const embedding = await generateEmbedding(data.content);
    const vectorStr = `[${embedding.join(",")}]`;

    // Create Blog
    const blog = await blogRepository.create({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || data.content.substring(0, 150) + "...",
      category: data.category || [],
      slug: finalSlug,
      authorId: data.authorId,
      embedding: vectorStr,
    });

    return {
      code: 201,
      status: "success",
      message: "Blog created successfully",
      data: blog,
    };
  } catch (error) {
    console.error("CreateBlogService Error", error);
    return { code: 500, status: "error", message: "Unable to create blog post" };
  }
}