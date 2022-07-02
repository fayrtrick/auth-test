import { z } from "zod";

// Schemas
export const TokenSchema = z.object({
  refreshToken: z.string().min(1, { message: "Token required." }),
});

// Types
export type Token = z.infer<typeof TokenSchema>;
