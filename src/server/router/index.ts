import superjson from "superjson";

import { createRouter } from "./context";
import { authRouter } from "./auth";
import { tokensRouter } from "./tokens";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth-v1.", authRouter)
  .merge("token-v1", tokensRouter);

export type AppRouter = typeof appRouter;
