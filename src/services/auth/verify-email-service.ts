import { UserRepository } from "@/repositories/user.repository";
import { TokenRepository } from "@/repositories/token.repository";

export async function VerifyEmailService(token: string) {
  const userRepository = new UserRepository();
  const tokenRepository = new TokenRepository();

  // Email Verification Logic
  try {
    // Check Token in the Database
    const record = await tokenRepository.findActiveEmailVerificationToken(token);
    if (!record) {
      return { code: 404, status: "error", message: "Verification token not found" };
    }

    // Check if the Token is still valid and not expired
    if (record.expiresAt.getTime() < Date.now()) {
      await tokenRepository.revokeToken(record.id);
      return { code: 410, status: "error", message: "Verification token expired" };
    }

    // Check if User is available
    const user = await userRepository.findById(record.userId);
    if (!user) {
      await tokenRepository.revokeToken(record.id);
      return { code: 404, status: "error", message: "User not found for this token" };
    }

    // Check if Email already verified
    if (user.emailVerified) {
      return { code: 200, status: "success", message: "Email already verified" };
    }

    // Mark the Email as Verified
    await userRepository.markEmailVerified(user.id);
    
    // Mark as Consumed
    await tokenRepository.consumeToken(record.id);

    // Success message
    return {
      code: 200,
      status: "success",
      message: "Verified Email Successfully!",
    };

  } catch (error) {
    console.error("VerifyEmailService error", error);
    return { code: 500, status: "error", message: "Unable to verify account" };
  }
}