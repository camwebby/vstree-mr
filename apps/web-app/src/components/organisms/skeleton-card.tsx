import { Card, CardHeader } from "vst-ui";
import { Skeleton } from "vst-ui";

export const SkeletonCard = () => {
  return (
    <>
      <Card className="flex items-center space-x-4 bg-background">
        <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
          <Skeleton className="h-12 w-12 rounded-full bg-slate-200" />
          <div className=" space-y-2">
            <Skeleton className="h-4 w-[250px] bg-slate-200" />
            <Skeleton className="h-4 w-[200px] bg-slate-200" />
          </div>
        </CardHeader>
      </Card>
    </>
  );
};
