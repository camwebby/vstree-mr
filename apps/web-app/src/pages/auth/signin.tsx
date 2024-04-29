import AuthenticationPage from "@/components/pages/auth";
import { authOptions } from "@/server/auth";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { H } from "highlight.run";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = authOptions.providers.map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    options: p.options,
  }));

  H.track("SS Next auth providers", {
    providers: JSON.stringify(providers),
  });

  return {
    props: { providers: providers ?? [] },
  };
}

export default function Auth({
  providers,
}: {
  providers: {
    id: string;
    name: string;
    type: string;
    options: Record<string, string>;
  }[];
}) {
  H.track("Next auth providers", {
    providers: JSON.stringify(providers),
  });

  const router = useRouter();
  const { error } = router.query;

  return <AuthenticationPage providers={providers} error={error} />;
}
