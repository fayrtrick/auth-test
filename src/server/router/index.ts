import superjson from "superjson";

import { createRouter } from "./context";
import { authRouter } from "./auth";
import { tokensRouter } from "./tokens";
import { winesRouter } from "./wines";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth/v1/", authRouter)
  .merge("token/v1/", tokensRouter)
  .merge("wines/v1/", winesRouter);

export type AppRouter = typeof appRouter;
