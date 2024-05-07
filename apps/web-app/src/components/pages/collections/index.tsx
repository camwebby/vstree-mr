import { api } from "@/utils/api";
import Head from "next/head";
import { useState } from "react";
import { CollectionCard } from "../../organisms/collection-card";
import CollectionActionBar from "./partials/action-bar";
import { collectionSortOptions } from "@/constants/collection";
import Layout from "@/components/layout/primary";

export function Collections() {
  const [orderBy, setOrderBy] = useState<
    (typeof collectionSortOptions)[number]["value"]
  >(collectionSortOptions[0].value);

  const { data } = api.collection.getAll.useInfiniteQuery(
    {
      limit: 1000,
      orderBy,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <Layout>
      <Head>
        <title>Collections | vstree</title>
      </Head>

      <CollectionActionBar orderBy={orderBy} setOrderBy={setOrderBy} />

      <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-2 2xl:grid-cols-3">
        {data?.pages
          .flatMap((page) => page.items)
          .map((collection) => {
            return <CollectionCard key={collection.id} {...collection} />;
          })}
      </div>
    </Layout>
  );
}
