import { z } from "zod";
import jwt from "jsonwebtoken";
import nookies from "nookies";

import { verifyRefreshToken } from "../../utils/token";
import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";

const tokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const tokensRouter = createRouter()
  .mutation("refresh", {
    input: z.object({
      refreshToken: z.string().min(1, { message: "Token required." }),
    }),
    async resolve({ ctx, input }) {
      verifyRefreshToken(ctx.req.body)
        .then(({ tokenDetails }) => {
          const payload = {
            email: tokenDetails.email,
            xsrfToken: tokenDetails.xsrfToken,
          };
          const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
            { expiresIn: "14m" }
          );
          nookies.set(ctx, "access_token", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 14,
            path: "/",
          });
        })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erreur lors de la création du token.",
          });
        });
    },
  })
  .mutation("logout", {
    async resolve({ ctx }) {
      try {
        const { refreshToken } = ctx.req.body;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors du logout.",
        });
      }

      const userToken = await ctx.prisma.userToken.findFirst({
        where: { token: ctx.req.body.refreshToken },
      });
      if (userToken) {
        await ctx.prisma.userToken.delete({
          where: { id: userToken.id },
        });
      }
    },
  });
