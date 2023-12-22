import { CollectionPage } from "@/components/pages/collection";
import { NextPage } from "next";
import { useRouter } from "next/router";

const CollectionSlugPage: NextPage<{
  slug: string;
}> = () => {
  const slug = useRouter().query.slug as string;

  return <CollectionPage slug={slug} />;
};

export default CollectionSlugPage;
