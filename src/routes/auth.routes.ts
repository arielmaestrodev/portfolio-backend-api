import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validateSchema } from "@/middlewares/validate-schema";
import { signupSchema, loginSchema, verifyEmailSchema, resendVerificationSchema, refreshTokenSchema } from "@/schema/auth";

// Initialize
const router = Router();
const authController = new AuthController();

// Authentication Routes
router.post("/v1/signup", validateSchema(signupSchema), authController.signup);
router.post("/v1/login", validateSchema(loginSchema), authController.login);
router.get("/v1/verify-email", validateSchema(verifyEmailSchema), authController.verifyEmail);
router.post("/v1/resend-email-verification", validateSchema(resendVerificationSchema), authController.resendEmailVerification);
router.post("/v1/refresh-token", validateSchema(refreshTokenSchema), authController.refresh);

export default router;