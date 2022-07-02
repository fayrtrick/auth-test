import { ReactNode } from "react";
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
  login: () => void;
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
    error: boolean;
  };
};
