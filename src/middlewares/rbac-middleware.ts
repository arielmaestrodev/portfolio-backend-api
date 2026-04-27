import { NextFunction, Request, Response } from "express";
import { Role } from "@/generated/prisma/enums";
import { JwtPayload } from "@/lib/jwt";

type AuthenticatedRequest = Request & { user?: JwtPayload };

/**
 * Middleware to check if the authenticated user has one of the required roles.
 * @param roles Array of allowed roles
 */
export const permittedRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Authentication required",
      });
    }
    if (!roles.includes(authReq.user.role as Role)) {
      return res.status(403).json({
        code: 403,
        status: "error",
        message: "Forbidden: You do not have the required role",
      });
    }

    return next();
  };
};
