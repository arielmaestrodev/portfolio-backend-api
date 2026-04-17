import { BlogRepository, BlogData } from "@/repositories/blog.repository";

interface UpdateBlogData {
  id: string;
  authorId: string; // The ID of the user attempting the update
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string[];
}

export async function UpdateBlogService(data: UpdateBlogData) {
  const blogRepository = new BlogRepository();

  try {
    const existing = await blogRepository.findById(data.id);
    
    if (!existing) {
      return { code: 404, status: "error", message: "Blog post not found" };
    }

    // Authorization Check: Only the author can update their post
    if (existing.authorId !== data.authorId) {
      return { code: 403, status: "error", message: "You are not authorized to edit this post" };
    }

    const updateData: Partial<BlogData> = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      category: data.category,
    };

    // Update slug if title changed
    if (data.title && data.title !== existing.title) {
       updateData.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
       
       const slugExists = await blogRepository.findBySlug(updateData.slug);
       if (slugExists && slugExists.id !== data.id) {
         updateData.slug = `${updateData.slug}-${Date.now()}`;
       }
    }

    const blog = await blogRepository.update(data.id, updateData);

    return {
      code: 200,
      status: "success",
      message: "Blog updated successfully",
      data: blog,
    };
  } catch (error) {
    console.error("UpdateBlogService Error", error);
    return { code: 500, status: "error", message: "Unable to update blog post" };
  }
}
