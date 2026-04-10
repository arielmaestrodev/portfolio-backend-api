import { z } from "zod";

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string().uuid("Invalid verification token format"),
  }),
});
