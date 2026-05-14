import { BlogRepository } from "@/repositories/blog.repository";

export async function GetBlogService(idOrSlug: string) {
  const blogRepository = new BlogRepository();

  try {
    // Check if the input is a UUID (standard ID) or a Slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    let blog;
    if (isUuid) {
      blog = await blogRepository.findById(idOrSlug);
    } else {
      blog = await blogRepository.findBySlug(idOrSlug);
    }

    if (!blog) {
      return { code: 404, status: "error", message: "Blog post not found" };
    }

    return {
      code: 200,
      status: "success",
      data: blog,
    };
  } catch (error) {
    console.error("GetBlogService Error", error);
    return { code: 500, status: "error", message: "Unable to retrieve blog post" };
  }
}