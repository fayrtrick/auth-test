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

  const getMutation = (mutation: "auth-v1.login" | "token-v1.logout") => {
    return trpc.useMutation(mutation, {
      onSuccess(data, variables, context) {
        const user: UserCtx = { connected: false, details: { error: false } };
        if (mutation === "auth-v1.login") {
          user.connected = true;
          user.details = { ...user.details, email: variables!.email };
        }
        setUser(user);
      },
      onError(error, variables, context) {
        console.log(error);
        setUser({
          connected: false,
          details: { error: true },
        });
      },
    });
  };

  const loginMutation = getMutation("auth-v1.login");
  const logoutMutation = getMutation("token-v1.logout");

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
