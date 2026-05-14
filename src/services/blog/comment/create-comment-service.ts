import { CommentRepository } from "@/repositories/comment.repository";

export const CreateCommentService = async (userId: string, loggedUserId: string, blogId: string, content: string) => {
  const commentRepository = new CommentRepository();

  try {
    // Verify ownership (Anti-Spoofing check)
    if (userId !== loggedUserId) {
      return { code: 403, status: "error", message: "Unauthorized User" };
    }

    const comment = await commentRepository.create({
      content,
      userId: loggedUserId,
      blogId,
    });

    return {
      code: 201,
      status: "success",
      message: "Comment posted successfully",
      data: { comment },
    };
  } catch (error) {
    console.error("CreateCommentService Error", error);
    return { code: 500, status: "error", message: "Failed to post comment" };
  }
};
