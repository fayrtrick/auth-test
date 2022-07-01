// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import "../styles/globals.css";
import { AuthProvider, getUser, UserCtx } from "../contexts/AuthContext";
import App, { AppContext, AppProps } from "next/app";
import { ComponentType } from "react";

type Props = {
  Component: ComponentType;
  pageProps: any;
  auth: UserCtx;
};

const MyApp = ({ Component, pageProps, auth }: Props) => {
  return (
    <AuthProvider authData={auth}>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const auth = await getUser(appContext.ctx);
  return { ...appProps, auth: auth };
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
