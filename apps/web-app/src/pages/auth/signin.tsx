import { useRouter } from "next/router";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import AuthenticationPage from "@/components/pages/auth";

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
  const router = useRouter();
  const { error } = router.query;

  return <AuthenticationPage providers={providers} error={error} />;
}
