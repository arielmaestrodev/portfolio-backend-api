import { z } from "zod";

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ message: "Refresh token is required" }),
  }),
});
