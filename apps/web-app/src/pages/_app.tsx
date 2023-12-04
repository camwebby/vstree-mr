import "vst-ui/src/styles/globals.css"
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import { Toaster } from "vst-ui";
import { NewCollection } from "@/components/organisms/new-collection";
import NewCollectionProvider from "@/contexts/new-collection";
import { ThemeProvider } from "@/contexts/theme";

const VSTApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      {/* <HighlightInit
        projectId={"qe911n4g"}
        environment={env.NODE_ENV}
        serviceName="vst-tree-client"
        tracingOrigins={["localhost", "vst-tree.vercel.app/api/trpc"]}
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [],
        }}
      /> */}
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
