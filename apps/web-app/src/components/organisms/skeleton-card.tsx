import { Card, CardHeader } from "vst-ui";
import { Skeleton } from "vst-ui";

export const SkeletonCard = () => {
  return (
    <>
      <Card className="flex items-center space-x-4 bg-background p-3">
        <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-3 space-y-0">
          <Skeleton className="h-12 w-12 rounded-full bg-muted-foreground" />
          <div className=" space-y-2">
            <Skeleton className="h-4 w-[220px] bg-muted-foreground" />
            <Skeleton className="h-4 w-[180px] bg-muted-foreground" />
          </div>
        </CardHeader>
      </Card>
    </>
  );
};
