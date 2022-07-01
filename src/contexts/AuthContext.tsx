import { NextPageContext } from "next";
import React, { createContext, ReactNode, useContext, useState } from "react";
import nookies, { setCookie, destroyCookie } from "nookies";
import { boolean } from "zod";
import { trpc } from "../utils/trpc";

type authContextType = {
  user: UserCtx;
  login: () => void;
  logout: () => void;
};

type Props = {
  authData: any;
  children: ReactNode;
};

export type UserCtx = {
  connected: boolean;
  details: {
    email?: string;
  };
};

const authContextDefaultValues: authContextType = {
  user: { connected: false, details: {} },
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

export const getUser = async (ctx: NextPageContext) => {
  const access_token = nookies.get(ctx);
  const user = { connected: true, details: { email: "toto@gmail.com" } };
  return user;
};

export function AuthProvider({ authData, children }: Props) {
  const [user, setUser] = useState<UserCtx>(
    authData || { connected: false, details: {} }
  );
  const loginMutation = trpc.useMutation("auth-v1.login", {
    onSuccess() {
      setUser({
        connected: true,
        details: {
          email: "toto@gmail.com",
        },
      });
    },
    onError(error) {
      console.log(error);
      setUser({
        connected: false,
        details: {},
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
    setUser({ connected: false, details: {} });
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
