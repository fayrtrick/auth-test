import Head from "next/head";
import Link from "next/link";
import NextError from "next/error";

import { trpc } from "../../utils/trpc";

const Wines = () => {
  const winesQuery = trpc.useQuery(["wines/v1/all"]);
  console.log(winesQuery);
  if (winesQuery.error) {
    return (
      <NextError
        title={winesQuery.error.message}
        statusCode={winesQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (winesQuery.status !== "success") {
    return <>Loading...</>;
  }

  const { data } = winesQuery;
  return (
    <>
      <Head>
        <title>Nos vins</title>
        <meta name="description" content="Liste des vins" />
      </Head>
      <ul>
        {data.map((wine) => (
          <li key={wine.id}>
            <p>{JSON.stringify(wine)}</p> See{" "}
            <Link href={`/wines/${wine.id}`}>more</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Wines;
