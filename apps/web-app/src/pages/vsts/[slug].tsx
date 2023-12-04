import { VstPage } from "@/components/pages/vst";
import { GetServerSideProps } from "next";

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

const VstSlugPage = ({ ...props }: { slug: string }) => {
  return <VstPage slug={props.slug} />;
};

export default VstSlugPage;
