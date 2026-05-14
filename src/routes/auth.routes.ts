import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validateSchema } from "@/middlewares/validate-schema";
import { signupSchema, loginSchema, verifyEmailSchema, resendVerificationSchema, refreshTokenSchema } from "@/schema/auth";
import { AuthMiddleware } from "@/middlewares/auth-middleware";

// Initialize
const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// Authentication Routes
router.post("/v1/signup", validateSchema(signupSchema), authController.signup);
router.post("/v1/login", validateSchema(loginSchema), authController.login);
router.get("/v1/verify-email", validateSchema(verifyEmailSchema), authController.verifyEmail);
router.post("/v1/resend-email-verification", validateSchema(resendVerificationSchema), authController.resendEmailVerification);
router.post("/v1/refresh-token", validateSchema(refreshTokenSchema), authController.refresh);
router.post("/v1/logout", authController.logout);

// Session Verification
router.get("/v1/me", authMiddleware.execute, authController.me);

export default router;