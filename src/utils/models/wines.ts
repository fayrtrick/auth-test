import { z } from "zod";

export const WineSchema = z.object({
  name: z.string().min(1),
  origin: z.string().min(1),
  price: z.number().max(10000),
});

export type Wine = z.infer<typeof WineSchema>;
