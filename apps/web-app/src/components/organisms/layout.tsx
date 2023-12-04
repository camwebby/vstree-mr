import Link from "next/link";
import { Button } from "vst-ui";
import { Header } from "./header";
import { useRouter } from "next/router";
import { NewCollectionContext } from "@/contexts/new-collection";
import { useContext } from "react";
import { PencilIcon, PlusIcon } from "lucide-react";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

export const insSans = localFont({
  src: [
    {
      path: "../../fonts/Givonic-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/Givonic-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/Givonic-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const {
    showNewCollectionForm,
    setShowNewCollectionForm,
    setMinimized,
    form,
  } = useContext(NewCollectionContext);

  return (
    <main
      className={cn(
        "min-w-screen relative min-h-screen bg-muted",
        insSans.className,
      )}
    >
      <Header className={insSans.className} />

      <div className="relative grid grid-cols-5">
        <div
          className="
        sticky top-0  col-span-1
        hidden  h-screen flex-col gap-y-2 overflow-x-hidden bg-background p-5 lg:col-span-1 lg:flex"
        >
          <Button
            asChild
            variant={router.pathname === "/" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              VSTs
            </Link>
          </Button>
          <Button
            variant={router.pathname === "/collections" ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link href="/collections">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              Collections
            </Link>
          </Button>

          <div className="flex-grow" />
          <Button
            onClick={() => {
              if (showNewCollectionForm) {
                setMinimized(false);
              }
              setShowNewCollectionForm(true);
              setMinimized(false);
            }}
            className="rounded-md p-3 "
          >
            {showNewCollectionForm ? (
              <div className="flex items-center text-sm font-normal">
                <PencilIcon size={14} className="mr-2" />
                <span>
                  Edit {form.getValues("collectionName") || "Collection"}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-sm font-normal">
                <PlusIcon size={14} className="mr-2" />
                Create collection
              </div>
            )}
          </Button>
          <div className="my-10" />
        </div>

        <div className="col-span-5 bg-background/30 lg:col-span-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default Layout;
