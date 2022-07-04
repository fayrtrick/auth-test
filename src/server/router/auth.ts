import crypto from "crypto";
import argon2 from "argon2";
import nookies from "nookies";
import { TRPCError } from "@trpc/server";

import { createRouter } from "./context";
import { generateTokens } from "../../utils/token";
import { UserDetailsSchema, UserSchema } from "../../utils/models/auth";

export const authRouter = createRouter()
  .mutation("register", {
    input: UserSchema,
    async resolve({ ctx, input }) {
      const userExists = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (userExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email déjà enregistrée.",
        });
      }

      const hashedPassword = await argon2.hash(input.password);
      const user = await ctx.prisma.user.create({
        data: { ...input, password: hashedPassword },
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Erreur lors de la création de l'utilisateur.`,
        });
      }

      return {
        ...user,
        password: "",
      };
    },
  })
  .mutation("login", {
    input: UserDetailsSchema,
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Aucun compte avec l'email donnée.",
        });
      }

      const passwordsMatch = await argon2.verify(user.password, input.password);
      if (!passwordsMatch) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mot de passe incorrect.",
        });
      }

      const xsrfToken = crypto.randomBytes(64).toString("hex");
      const { accessToken, refreshToken } = await generateTokens(
        user,
        xsrfToken
      );

      nookies.set(ctx, "access_token", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 1,
        path: "/",
      });
      nookies.set(ctx, "refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 30,
        path: "/token",
      });

      return xsrfToken;
    },
  });
