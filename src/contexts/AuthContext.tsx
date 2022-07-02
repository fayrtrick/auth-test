import { NextPageContext } from "next";
import React, { createContext, ReactNode, useContext, useState } from "react";
import nookies from "nookies";

import { trpc } from "../utils/trpc";
import { AuthContext, AuthProps, UserCtx } from "../utils/models/auth";

const authContextDefaultValues: AuthContext = {
  user: { connected: false, details: { error: false } },
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContext>(authContextDefaultValues);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const getUser = async (ctx: NextPageContext) => {
  const access_token = nookies.get(ctx);
  const user = { connected: false, details: { error: false } };
  return user;
};

export const AuthProvider = ({ authData, children }: AuthProps) => {
  const [user, setUser] = useState<UserCtx>(
    authData || { connected: false, details: { error: false } }
  );

  const loginMutation = trpc.useMutation("auth-v1.login", {
    onSuccess(data, variables, context) {
      setUser({
        connected: true,
        details: {
          email: variables.email,
          error: false,
        },
      });
    },
    onError(error, variables, context) {
      console.log(error);
      setUser({
        connected: false,
        details: { error: true },
      });
    },
  });

  const logoutMutation = trpc.useMutation("token-v1.logout", {
    onSuccess(data, variables, context) {
      setUser({
        connected: true,
        details: { error: false },
      });
    },
    onError(error, variables, context) {
      console.log(error);
      setUser({
        connected: false,
        details: { error: true },
      });
    },
  });

  const login = () => {
    loginMutation.mutate({
      email: "masmeert@gmail.com",
      password: "superpassword",
    });
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
