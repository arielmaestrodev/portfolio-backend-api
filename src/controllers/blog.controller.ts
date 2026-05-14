import { Request, Response } from "express";
import { CreateBlogService, UpdateBlogService, DeleteBlogService, GetBlogService, GetAllBlogsService } from "@/services/blog";

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
}