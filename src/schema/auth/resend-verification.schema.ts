import { z } from "zod";

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format"),
  }),
});
