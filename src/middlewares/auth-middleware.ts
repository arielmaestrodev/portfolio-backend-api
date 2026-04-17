/*
  Middleware Logic:
  1. Expect every authenticated request to send `Authorization: Bearer <accessToken>`.
  2. If the token is valid, attach its payload to `req.user` and continue.
  3. If it is missing or invalid, respond with 401 so the client can initiate a refresh using the dedicated endpoint.
*/

import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, JwtPayload } from "@/lib/jwt";

type AuthenticatedRequest = Request & { user?: JwtPayload };

export class AuthMiddleware {
  public execute = async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
    // 1. Try to get token from Authorization Header
    let accessToken = this.extractBearerToken(req.headers.authorization);

    // 2. Fallback to Cookies (for Web applications)
    if (!accessToken && req.cookies) {
      accessToken = req.cookies.accessToken;
    }

    if (!accessToken) {
      return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return res.status(401).json({ code: 401, status: "error", message: "Invalid or expired token" });
    }

    authReq.user = payload;
    return next();
  };

  private extractBearerToken(header?: string) {
    if (!header) return undefined;
    const [scheme, token] = header.split(" ");
    if (!scheme || scheme.toLowerCase() !== "bearer" || !token) return undefined;
    return token.trim();
  }
}