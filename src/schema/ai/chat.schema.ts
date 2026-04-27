import { z } from "zod";

export const askSchema = z.object({
  body: z.object({
    question: z.string().min(1, "Question is required"),
    history: z.array(
      z.object({
        role: z.enum(["user", "model"]),
        parts: z.array(
          z.object({
            text: z.string().min(1)
          })
        )
      })
    ).optional()
  })
});