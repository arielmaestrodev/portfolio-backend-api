import { Request, Response } from "express";
import { CreateBlogService, UpdateBlogService, DeleteBlogService, GetBlogService, GetAllBlogsService } from "@/services/blog";
import { CreateCommentService } from "@/services/blog/comment/create-comment-service";
import { GetCommentsByBlogService } from "@/services/blog/comment/get-comments-service";
import { DeleteCommentService } from "@/services/blog/comment/delete-comment-service";

export class BlogController {
  // Create Blog
  public createBlog = async (req: Request, res: Response) => {
    const { userId, title, content, excerpt, category } = req.body ?? {};
    const authorId = (req as any).user?.sub;

    const result = await CreateBlogService({ userId, title, content, excerpt, category, authorId });
    return res.status(result.code).json(result);
  };

  // Update Blog
  public updateBlog = async (req: Request, res: Response) => {
    const { id, userId, title, content, excerpt, category } = req.body ?? {};
    const authorId = (req as any).user?.sub;

    const result = await UpdateBlogService({ id, userId, title, content, excerpt, category, authorId });
    return res.status(result.code).json(result);
  };

  // Delete Blog
  public deleteBlog = async (req: Request, res: Response) => {
    const { id, userId } = req.body ?? {};
    const authorId = (req as any).user?.sub;

    const result = await DeleteBlogService({ id, userId, authorId });
    return res.status(result.code).json(result);
  };

  // Get Blog
  public getBlog = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await GetBlogService(id);
    return res.status(result.code).json(result);
  };

  // Get All Blogs
  public getAllBlogs = async (req: Request, res: Response) => {
    const result = await GetAllBlogsService();
    return res.status(result.code).json(result);
  };

  // --- Blog Comment Methods ---

  public postComment = async (req: Request, res: Response) => {
    const loggedUserId = (req as any).user?.sub;
    const { blogId, content, userId } = req.body;
    
    const result = await CreateCommentService(userId, loggedUserId, blogId, content);
    return res.status(result.code).json(result);
  };

  public getComments = async (req: Request, res: Response) => {
    const blogId = req.params.blogId as string;
    const result = await GetCommentsByBlogService(blogId);
    return res.status(result.code).json(result);
  };

  public deleteComment = async (req: Request, res: Response) => {
    const loggedUserId = (req as any).user?.sub;
    const isAdmin = (req as any).user?.role === "ADMIN";
    const id = req.params.id as string;
    const { userId } = req.body;

    const result = await DeleteCommentService(id, userId, loggedUserId, isAdmin);
    return res.status(result.code).json(result);
  };
}