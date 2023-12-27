import "vst-ui/src/styles/globals.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import { Toaster } from "vst-ui";
import { NewCollection } from "@/components/organisms/new-collection";
import NewCollectionProvider from "@/contexts/new-collection";
import { ThemeProvider } from "@/contexts/theme";
import { env } from "@/env.mjs";
import { HighlightInit } from "@highlight-run/next/client";

const VSTApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <HighlightInit
        projectId={"lgxjrz4d"}
        environment={env.NEXT_PUBLIC_VERCEL_ENV || "development"}
        serviceName="vstree-web-app"
        tracingOrigins
        // tracingOrigins={["staging.vstree.app", "new.vstree.app"]}
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [],
        }}
      />
      <SessionProvider session={session}>
        <NewCollectionProvider>
          <NewCollection />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Component {...pageProps} />
          </ThemeProvider>
        </NewCollectionProvider>
        <Toaster />
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(VSTApp);
