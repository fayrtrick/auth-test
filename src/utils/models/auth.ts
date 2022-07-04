import { TRPCClientErrorLike } from "@trpc/client";
import { Router } from "next/router";
import { ReactNode } from "react";
import { Mutation, UseMutateFunction, UseMutationResult } from "react-query";
import { z } from "zod";

// Schemas
export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  forename: z.string().min(1),
  surname: z.string().min(1),
});

export const UserDetailsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Types
export type User = z.infer<typeof UserSchema>;
export type UserDetails = z.infer<typeof UserDetailsSchema>;
export type AuthContext = {
  user: UserCtx;
  errors: ErrorCtx;
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
export type ErrorCtx = {
  error: boolean;
  message: string;
};
