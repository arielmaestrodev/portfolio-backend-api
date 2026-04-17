import { Request, Response } from "express";
import { CreateBlogService, UpdateBlogService, DeleteBlogService, GetBlogService, GetAllBlogsService } from "@/services/blog";

export class BlogController {
  // Create Blog
  public createBlog = async (req: Request, res: Response) => {
    const { title, content, excerpt, category } = req.body ?? {};
    const authorId = (req as any).user?.sub;

    const result = await CreateBlogService({ title, content, excerpt, category, authorId });
    return res.status(result.code).json(result);
  };

  // Update Blog
  public updateBlog = async (req: Request, res: Response) => {
    const { id, title, content, excerpt, category } = req.body ?? {};
    const authorId = (req as any).user?.sub;

    const result = await UpdateBlogService({ id, title, content, excerpt, category, authorId });
    return res.status(result.code).json(result);
  };

  // Delete Blog
  public deleteBlog = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const authorId = (req as any).user?.sub;

    const result = await DeleteBlogService(id, authorId);
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