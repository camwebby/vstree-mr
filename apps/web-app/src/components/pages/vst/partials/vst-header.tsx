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
                className="flex items-end gap-x-3 pt-1 text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                <FactoryIcon
                  className="h-5 w-5 text-muted-foreground"
                  strokeWidth={1}
                />
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
