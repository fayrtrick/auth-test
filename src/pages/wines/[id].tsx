import Head from "next/head";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";

const WineDetails = () => {
  const id = useRouter().query.id as string;
  const winesQuery = trpc.useQuery(["wines/v1/byId", { id }]);
  if (!winesQuery.data) {
    return <div>Loading...</div>;
  }
  const { data } = winesQuery;
  return (
    <>
      <Head>
        <title>Nos vins</title>
        <meta name="description" content="Liste des vins" />
      </Head>
      <p>{JSON.stringify(data)}</p>
    </>
  );
};

export default WineDetails;
