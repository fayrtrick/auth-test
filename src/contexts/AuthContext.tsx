import { NextPageContext } from "next";
import React, { createContext, useContext, useState } from "react";
import nookies from "nookies";
import jwtDecode, { JwtPayload } from "jwt-decode";

import { trpc } from "../utils/trpc";
import {
  AuthContext,
  AuthProps,
  UserCtx,
  UserLogin,
} from "../utils/models/auth";
import axios from "axios";

const AuthContext = createContext<AuthContext>({} as AuthContext);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const getUser = async (ctx: any) => {
  axios.defaults.baseURL = "http://localhost:3000/";
  let accessToken = nookies.get(ctx).access_token || "";
  let decodedAccessToken: any = undefined;
  if (accessToken) decodedAccessToken = jwtDecode(accessToken);
  if (
    !accessToken ||
    (decodedAccessToken.exp && decodedAccessToken.exp * 1000 < Date.now())
  ) {
    const refreshToken = nookies.get(ctx).refresh_token;
    if (!refreshToken) return;
    await axios
      .get("/api/auth/refresh", {
        headers: {
          cookie: ctx.req.headers.cookie,
        },
      })
      .then(async (data) => {
        accessToken = data.data.token;
        await nookies.set(ctx, "access_token", data.data.token, {
          httpOnly: true,
          secure: false,
          maxAge: 60 * 14,
          path: "/",
        });
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }

  return axios
    .get("/api/user/reconnect", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res) => {
      return { connected: true, details: { ...res.data.user } };
    })
    .catch((err) => {
      return;
    });
};

export const AuthProvider = ({ authData, children }: AuthProps) => {
  const [user, setUser] = useState<UserCtx>(
    authData || { connected: false, details: {} }
  );

  const login = (data: UserLogin) => {
    return axios
      .post("/api/auth/login", data)
      .then((res) => onAuthSuccess(res.data.xsrfToken))
      .catch((err) => onAuthError(err.response.data));
  };

  const register = trpc.useMutation("auth.register", {
    onSuccess: (data) => onAuthSuccess(data.email),
    onError: (err) => onAuthError(err),
  });

  const onAuthSuccess = (xsrfToken: string) => {
    localStorage.setItem("xsrfToken", xsrfToken);
    setUser({
      connected: true,
      details: {
        email: "tot@gmail.com",
      },
    });
  };

  const onAuthError = (err: any) => {
    return err.message;
  };

  const logout = () => {
    // logoutMutation.mutate();
  };

  const value = {
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
