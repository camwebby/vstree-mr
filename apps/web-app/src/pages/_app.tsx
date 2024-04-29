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
import Head from "next/head";

const VSTApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      {!!env.NEXT_PUBLIC_VERCEL_ENV && (
        <HighlightInit
          projectId={"lgxjrz4d"}
          environment={env.NEXT_PUBLIC_VERCEL_ENV || "development"}
          version={env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "development"}
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
