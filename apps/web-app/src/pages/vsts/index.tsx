import { Vsts } from "@/components/pages/vsts";
import { appConfig } from "@/constants/app-config";
import Head from "next/head";

export default function VstPage() {
  return (
    <>
      <Head>
        <title>vsts | {appConfig?.appName}</title>
      </Head>
      <Vsts />
    </>
  );
}
