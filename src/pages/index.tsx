import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const logoutMutation = trpc.useMutation("token-v1.logout");

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/auth/login">login</Link>
      <Link href="/auth/register">register</Link>
      <button onClick={() => logoutMutation.mutate()}>logout</button>
    </>
  );
};

export default Home;
