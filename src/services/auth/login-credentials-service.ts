import { UserRepository } from "@/repositories/user.repository";
import { TokenRepository } from "@/repositories/token.repository";
import { verifyPassword } from "@/utils/password";
import { signAccessToken, signRefreshToken, TokenExpiry } from "@/lib/jwt";

export async function LoginCredentialsService(email: string, password: string) {
  const userRepository = new UserRepository();
    const tokenRepository = new TokenRepository();

  try {
    // Validate User Credentials
    const user = await userRepository.findByEmail(email);
    if (!user || !user.password || !verifyPassword(password, user.password)) {
      return { code: 400, status: "error", message: "Invalid Credentials" };
    }

    if (!user.emailVerified) {
      return { code: 403, status: "error", message: "Please verify your email first" };
    }

    // Generate Tokens
    const accessToken = signAccessToken(user.id, user.role, TokenExpiry.ACCESS_TOKEN_EXPIRES);
    const refreshToken = signRefreshToken(user.id, user.role, TokenExpiry.REFRESH_TOKEN_EXPIRES);

    // Save Refresh Token to DB for tracking/rotation
    await tokenRepository.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      code: 200,
      status: "success",
      message: "Login successful",
      data: {
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: TokenExpiry.ACCESS_TOKEN_EXPIRES,
          refreshExpiresIn: TokenExpiry.REFRESH_TOKEN_EXPIRES,
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    };
  } catch (error) {
    console.error("LoginCredentialService Error", error);
    return { code: 500, status: "error", message: "Unable to login account" };
  }
}