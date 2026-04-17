import crypto from "crypto";
import { UserRepository } from "@/repositories/user.repository";
import { TokenRepository } from "@/repositories/token.repository";
import { renderTemplate } from "@/utils/template";
import { sendEmail } from "@/services/mail/mailer";

export async function ResendEmailVerificationService(email: string) {
  const userRepository = new UserRepository();
  const tokenRepository = new TokenRepository();

  try {
    // Check if User is found
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { code: 404, status: "error", message: "User not found" };
    }

    // Check if Email is verified already
    if (user.emailVerified) {
      return { code: 200, status: "success", message: "Email already verified" };
    }

    // Check the Previous Email Verification Token
    const previousToken = await tokenRepository.findLatestEmailVerificationTokenByUser(user.id);
    if (!previousToken) {
      return { code: 400, status: "error", message: "No verification token available to resend" };
    }

    // Check if the token is already consumed
    if (previousToken.consumedAt) {
      return { code: 400, status: "error", message: "Verification link already used" };
    }

    // Check if there's still valid token
    if (previousToken.expiresAt.getTime() > Date.now()) {
      return { code: 400, status: "error", message: "Current verification link is still valid" };
    }

    await tokenRepository.revokeToken(previousToken.id);
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await tokenRepository.createEmailVerificationToken({ userId: user.id, token, expiresAt });

    const emailVerificationURL = `${process.env.BACKEND_URL}/api/auth/v1/verify-email?token=${encodeURIComponent(token)}`;

    const html = renderTemplate("verify-email.html", {
      name: user.name ?? "there",
      emailVerificationURL,
      expiresAt: expiresAt.toUTCString(),
    });

    await sendEmail({
      to: user.email ?? email,
      subject: "Verify your email address",
      html,
    });

    return {
      code: 200,
      status: "success",
      message: "Verification email resent successfully",
    };
  } catch (error) {
    console.error("ResendEmailVerificationService error", error);
    return { code: 500, status: "error", message: "Unable to resend verification email" };
  }
}
