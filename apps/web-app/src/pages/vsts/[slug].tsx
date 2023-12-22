import { VstPage } from "@/components/pages/vst";
import { useRouter } from "next/router";

const VstSlugPage = () => {
  const slug = useRouter().query.slug as string;

  return <VstPage slug={slug} />;
};

export default VstSlugPage;
