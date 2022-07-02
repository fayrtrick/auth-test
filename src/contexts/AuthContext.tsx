import { NextPageContext } from "next";
import React, { createContext, ReactNode, useContext, useState } from "react";
import nookies from "nookies";

import { trpc } from "../utils/trpc";
import {
  AuthContext,
  AuthProps,
  UserCtx,
  ErrorCtx,
} from "../utils/models/auth";
import { Mutation, useMutation } from "react-query";
import { TRPCError } from "@trpc/server";
import { TRPCClientErrorLike } from "@trpc/client";
import { Router } from "next/router";

const AuthContext = createContext<AuthContext>({} as AuthContext);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const getUser = async (ctx: NextPageContext) => {
  const access_token = nookies.get(ctx);
  console.log(access_token);
  const user = { connected: false, details: { error: false } };
  return user;
};

export const AuthProvider = ({ authData, children }: AuthProps) => {
  const [user, setUser] = useState<UserCtx>(
    authData || { connected: false, details: { error: false } }
  );

  const [errors, setErrors] = useState<ErrorCtx>({ error: false, message: "" });

  // const getMutation = (mutation: "auth/v1/login" | "token/v1/logout") => {
  //   return trpc.useMutation(mutation, {
  //     onSuccess(data, variables, context) {
  //       const user: UserCtx = { connected: false, details: { error: false } };
  //       if (mutation === "auth/v1/login") {
  //         user.connected = true;
  //         user.details = { ...user.details, email: variables!.email };
  //       }
  //       setUser(user);
  //     },
  //     onError(error, variables, context) {
  //       console.log(error);
  //       setUser({
  //         connected: false,
  //         details: { error: true },
  //       });
  //     },
  //   });
  // };

  // const loginMutation = getMutation("auth/v1/login");
  // const logoutMutation = getMutation("token/v1/logout");

  const login = trpc.useMutation("auth.login", {
    onSuccess: (data) => onAuthSuccess(data, "toto@gmail.com"),
    onError: (err) => onAuthError(err),
  });

  const register = trpc.useMutation("auth.register", {
    onSuccess: (data) => {
      localStorage.setItem;
    },
  });

  const onAuthSuccess = (xsrfToken: string, email: string) => {
    localStorage.setItem("xsrfToken", xsrfToken);
    setUser({
      connected: true,
      details: {
        email: email,
      },
    });
  };

  const onAuthError = (err: any) => {
    setErrors({ error: true, message: err.message });
  };

  const logout = () => {
    // logoutMutation.mutate();
  };

  const value = {
    user,
    errors,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
