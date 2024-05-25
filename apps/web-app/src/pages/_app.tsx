import AppHead from "@/components/layout/app-head";
import NewCollection from "@/components/organisms/new-collection";
import NewCollectionProvider from "@/contexts/new-collection";
import { ThemeProvider } from "@/contexts/theme";
import { env } from "@/env.mjs";
import { api } from "@/utils/api";
import { HighlightInit } from "@highlight-run/next/client";
import { ErrorBoundary } from "@highlight-run/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Toaster } from "vst-ui";
import "vst-ui/src/styles/globals.css";

const VSTApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <AppHead />
      {!!env.NEXT_PUBLIC_VERCEL_ENV && (
        <HighlightInit
          projectId={"lgxjrz4d"}
          environment={env.NEXT_PUBLIC_VERCEL_ENV ?? "development"}
          version={env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "development"}
          serviceName="vstree-web-app"
          tracingOrigins={[
            "dash.vstree.app",
            "dash.vstree.app/api",
            "staging.vstree.app",
            "staging.vstree.app/api",
          ]}
          networkRecording={{
            enabled: true,
            recordHeadersAndBody: true,
            urlBlocklist: [],
          }}
        />
      )}

      <ErrorBoundary>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <NewCollectionProvider>
              <NewCollection />
              <Component {...pageProps} />
              <Toaster />
            </NewCollectionProvider>
          </SessionProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </>
  );
};

export default api.withTRPC(VSTApp);
