import { BlogRepository } from "@/repositories/blog.repository";

export async function GetAllBlogsService() {
  const blogRepository = new BlogRepository();

  try {
    const blogs = await blogRepository.findAll();

    return {
      code: 200,
      status: "success",
      data: blogs,
    };
  } catch (error) {
    console.error("GetAllBlogsService Error", error);
    return { code: 500, status: "error", message: "Unable to retrieve blog posts" };
  }
}
