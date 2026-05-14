import { CommentRepository } from "@/repositories/comment.repository";

const commentRepository = new CommentRepository();

export const GetCommentsByBlogService = async (blogId: string) => {
  try {
    const comments = await commentRepository.findByBlogId(blogId);

    return {
      code: 200,
      status: "success",
      data: { comments },
    };
  } catch (error) {
    console.error("GetCommentsByBlogService Error", error);
    return { code: 500, status: "error", message: "Failed to fetch comments" };
  }
};
