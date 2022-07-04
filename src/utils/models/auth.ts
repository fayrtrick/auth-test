import { TRPCClientErrorLike } from "@trpc/client";
import { Router } from "next/router";
import { ReactNode } from "react";
import { Mutation, UseMutateFunction, UseMutationResult } from "react-query";
import { z } from "zod";

// Schemas
export const UserRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  forename: z.string().min(1),
  surname: z.string().min(1),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Types
export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type AuthContext = {
  user: UserCtx;
  login: any;
  register: any;
  logout: () => void;
};
export type AuthProps = {
  authData: any;
  children: ReactNode;
};
export type UserCtx = {
  connected: boolean;
  details: {
    email?: string;
  };
};
