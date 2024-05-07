import { H } from "highlight.run";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export const useRedirectOnUnauthenticated = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [loading, setLoading] = useState(status !== "authenticated");

  useEffect(() => {
    if (status === "unauthenticated") {
      router?.push("/auth/signin");
    }

    if (status === "authenticated") {
      !!session.user.email &&
        H.identify(
          session?.user.email,
          session?.user as Record<string, string>,
        );

      setLoading(false);
    }
  }, [session, status, router]);

  return {
    loading,
  };
};
