// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import superjson from "superjson";
import "../styles/globals.css";
import { AuthProvider, getUser, UserCtx } from "../contexts/AuthContext";
import App, { AppContext } from "next/app";
import { Component, ComponentType } from "react";

const MyApp = ({ Component, pageProps }: any) => {
  console.log(pageProps.auth);
  return (
    <AuthProvider authData={pageProps.auth}>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const auth = await getUser(appContext.ctx);
  console.log(auth);
  return { ...appProps, pageProps: { ...appProps.pageProps, auth } };
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
    };
  },
  ssr: false,
})(MyApp);
