import { NextPageContext } from "next";
import React, { createContext, ReactNode, useContext, useState } from "react";
import nookies, { setCookie, destroyCookie } from "nookies";
import { boolean } from "zod";

type authContextType = {
  user: {};
  login: () => void;
  logout: () => void;
};

type Props = {
  authData: any;
  children: ReactNode;
};

export interface UserCtx {
  connected: boolean;
  details: {
    email: string;
  };
}

const authContextDefaultValues: authContextType = {
  user: {},
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
  const [user, setUser] = useState(authData || ({} as UserCtx));

  const login = () => {
    setUser({
      connected: true,
      details: {
        email: "toto@gmail.com",
      },
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
