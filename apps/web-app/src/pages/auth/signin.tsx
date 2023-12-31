import AuthenticationPage from "@/components/pages/auth";
import { authOptions } from "@/server/auth";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { useRouter } from "next/router";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  console.log({ providers });

  return {
    props: { providers: providers ?? [] },
  };
}

export default function Auth({ providers }) {
  const router = useRouter();
  const { error } = router.query;

  return <AuthenticationPage providers={providers} error={error} />;
}
