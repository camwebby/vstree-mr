import { Loader2 } from "lucide-react";
import { Instrument_Sans } from "next/font/google";
import { useMemo } from "react";
import { cn } from "vst-ui/src/lib/utils";
import { Header } from "./header";
import { useRedirectOnUnauthenticated } from "./hooks";
import Sidebar from "./sidebar";

const sans = Instrument_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useRedirectOnUnauthenticated();
  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <>
      {loading ? (
        <div className="min-w-screen flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-5 w-5 animate-spin text-foreground" />
        </div>
      ) : (
        <>
          <main
            className={cn(
              "min-w-screen relative min-h-screen bg-muted",
              sans.className,
            )}
          >
            <Header className={sans.className} />

            <div className="relative grid grid-cols-5">
              <Sidebar />
              <div className="col-span-5 bg-background/80 lg:col-span-4">
                {memoizedChildren}
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default Layout;
