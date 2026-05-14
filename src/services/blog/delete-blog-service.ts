import { BlogRepository } from "@/repositories/blog.repository";
import { DeleteBlogInput } from "@/schema/blog";

type DeleteBlogData = DeleteBlogInput & { authorId: string };

export async function DeleteBlogService({ id, userId, authorId }: DeleteBlogData) {
  const blogRepository = new BlogRepository();

  try {
    // Verify ownership
    if (authorId !== userId) {
      return { code: 403, status: "error", message: "Unauthorized to delete this post!" };
    }

    const existing = await blogRepository.findById(id);

    if (!existing) {
      return { code: 404, status: "error", message: "Blog post not found" };
    }

    // Authorization Check: Only the author can delete their post
    if (existing.authorId !== authorId) {
      return { code: 403, status: "error", message: "You are not authorized to delete this post" };
    }

    await blogRepository.delete(id);

    return {
      code: 200,
      status: "success",
      message: "Blog deleted successfully",
    };
  } catch (error) {
    console.error("DeleteBlogService Error", error);
    return { code: 500, status: "error", message: "Unable to delete blog post" };
  }
}