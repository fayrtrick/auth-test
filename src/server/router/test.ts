import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";

export const testRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const { cookies } = ctx.req;
    if (!cookies || !cookies.access_token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Pas de token trouvé.",
      });
    }
    return next();
  })
  .query("test", {
    resolve() {
      return "Salut";
    },
  });
