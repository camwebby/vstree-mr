
import { CollectionPage } from "@/components/pages/collection";
import {
  GetServerSideProps,
  NextPage,
} from "next";

export const getServerSideProps: GetServerSideProps = async ({ ...props }) => {
  const { slug } = props.params as { slug: string };

  if (!slug) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug,
    },
  };
};

const CollectionSlugPage: NextPage<{
  slug: string;
}> = ({ ...props }) => {
  return <CollectionPage slug={props.slug} />;
};

export default CollectionSlugPage;
