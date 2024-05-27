import VSTAvatar from "@/components/organisms/vst-avatar";
import { FactoryIcon } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { Vst } from "vst-database";
import { Skeleton } from "vst-ui";

const VSTHeader = ({ vst, isLoading }) => {
  return (
    <section className="w-full border-b border-l border-border bg-background px-8 py-20">
      <div className="mx-auto flex items-center gap-5 text-primary">
        <VSTAvatar className="h-20 w-20 rounded-md" item={vst as Vst} />
        <div>
          {isLoading ? (
            <>
              <Skeleton className="mb-2 h-5 w-52" />
              <Skeleton className="h-5 w-32" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">
                {vst?.name}
              </h1>
              <Link
                href={`/?creatorsFilter=${vst?.creatorName}`}
                className="flex items-end gap-x-2 pt-1 text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5 text-muted-foreground"
                >
                  <path d="M15.993 1.385a1.87 1.87 0 0 1 2.623 2.622l-4.03 5.27a12.749 12.749 0 0 1-4.237 3.562 4.508 4.508 0 0 0-3.188-3.188 12.75 12.75 0 0 1 3.562-4.236l5.27-4.03ZM6 11a3 3 0 0 0-3 3 .5.5 0 0 1-.72.45.75.75 0 0 0-1.035.931A4.001 4.001 0 0 0 9 14.004V14a3.01 3.01 0 0 0-1.66-2.685A2.99 2.99 0 0 0 6 11Z" />
                </svg>

                <span className="text-sm text-muted-foreground">
                  {vst?.creatorName}
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(VSTHeader);
