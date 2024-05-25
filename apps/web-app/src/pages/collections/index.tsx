import { Collections } from "@/components/pages/collections";
import { appConfig } from "@/constants/app-config";
import Head from "next/head";

export default function CollectionsPage() {
  return (
    <>
      <Head>
        <title>Collections | {appConfig.appName}</title>
      </Head>
      <Collections />
    </>
  );
}
