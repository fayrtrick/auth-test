import superjson from "superjson";

import { createRouter } from "./context";
import { authRouter } from "./auth";
import { tokensRouter } from "./tokens";
import { winesRouter } from "./wines";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("token.", tokensRouter)
  .merge("wines.", winesRouter);

export type AppRouter = typeof appRouter;
