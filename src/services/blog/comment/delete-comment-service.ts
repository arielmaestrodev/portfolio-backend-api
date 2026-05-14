import { CommentRepository } from "@/repositories/comment.repository";

export const DeleteCommentService = async (commentId: string, userId: string, loggedUserId: string, isAdmin: boolean) => {
  const commentRepository = new CommentRepository();
  
  try {
    // 1. Anti-Spoofing check
    if (userId && userId !== loggedUserId) {
      return { code: 403, status: "error", message: "Unauthorized User" };
    }

    const comment = await commentRepository.findById(commentId);

    if (!comment) {
      return { code: 404, status: "error", message: "Comment not found" };
    }

    // 2. Authorization Rules
    const isCommentOwner = comment.userId === loggedUserId;
    const isBlogOwner = (comment as any).blog?.authorId === loggedUserId;

    // Only allow deletion if user is:
    // - The original author of the comment
    // - The author of the blog post (Moderation)
    // - An administrator
    if (!isCommentOwner && !isBlogOwner && !isAdmin) {
      return { code: 403, status: "error", message: "Unauthorized User" };
    }

    await commentRepository.delete(commentId);

    return {
      code: 200,
      status: "success",
      message: "Comment deleted successfully",
    };
  } catch (error) {
    console.error("DeleteCommentService Error", error);
    return { code: 500, status: "error", message: "Failed to delete comment" };
  }
};