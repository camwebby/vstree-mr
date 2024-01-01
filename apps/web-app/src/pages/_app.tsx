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
import { ErrorBoundary } from "@highlight-run/react";

const VSTApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      {!!env.NEXT_PUBLIC_VERCEL_ENV && (
        <HighlightInit
          projectId={"lgxjrz4d"}
          environment={env.NEXT_PUBLIC_VERCEL_ENV}
          serviceName="vstree-web-app"
          tracingOrigins={[
            "new.vstree.app",
            "new.vstree.app/api",
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
