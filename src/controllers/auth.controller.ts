import { Request, Response } from "express";
import { SignupUserService, LoginCredentialsService, VerifyEmailService, RefreshTokenService, ResendEmailVerificationService } from "@/services/auth";
import { TokenExpiry, toMilliseconds } from "@/lib/jwt";
import { ENV } from "@/config/env";

export class AuthController {
  // Helper to set cookies
  private setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    const isProduction = ENV.NODE_ENV === "production";

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: toMilliseconds(TokenExpiry.ACCESS_TOKEN_EXPIRES),
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: toMilliseconds(TokenExpiry.REFRESH_TOKEN_EXPIRES),
    });
  }

  // Credentials Signup
  public signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body ?? {};
    const result = await SignupUserService(name, email, password);
    return res.status(result.code).json(result);
  };

  // Email Verification
  public verifyEmail = async (req: Request, res: Response) => {
    const token = req.query.token as string;
    const result = await VerifyEmailService(token);
    return res.status(result.code).json(result);
  };
  
  // Handle Login Account
  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    const result = await LoginCredentialsService(email, password);
    
    if (result.code === 200 && result.data?.tokens) {
      this.setAuthCookies(res, result.data.tokens);
    }

    return res.status(result.code).json(result);
  };

  // Refresh Token Helps Generate another valid Access Token
  public refresh = async (req: Request, res: Response) => {
    const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;
    const result = await RefreshTokenService(refreshToken);

    if (result.code === 200 && result.data?.tokens) {
      this.setAuthCookies(res, result.data.tokens);
    }

    return res.status(result.code).json(result);
  };

  // Handle Logout
  public logout = (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ code: 200, status: "success", message: "Logged out successfully" });
  };

  // Resend Email Verification
  public resendEmailVerification = async (req: Request, res: Response) => {
    const { email } = req.body ?? {};
    const result = await ResendEmailVerificationService(email);
    return res.status(result.code).json(result);
  };
}