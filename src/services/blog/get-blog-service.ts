import { BlogRepository } from "@/repositories/blog.repository";

export async function GetBlogService(id: string) {
  const blogRepository = new BlogRepository();

  try {
    const blog = await blogRepository.findById(id);
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
