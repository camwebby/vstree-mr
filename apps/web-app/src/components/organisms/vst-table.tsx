import dynamic from "next/dynamic";
import Link from "next/link";
import { Vst } from "vst-database";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "vst-ui";
import { SkeletonCard } from "../molecules/skeleton-card";
import VSTAvatar from "./vst-avatar";
import { VstCard } from "./vst-card";
import { memo } from "react";

const VSTHoverCard = dynamic(() => import("./vst-hover-card"), {
  ssr: false,
  loading: () => <SkeletonCard />,
});

const VSTTable = ({ data, title }: { data: Vst[]; title: string }) => {
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">See all</Button>
          </SheetTrigger>
          <SheetContent className=" overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>
                {data.length} {title.toLowerCase()}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-y-4 py-8">
              {data.map((vst, index) => (
                <VstCard key={"vst_" + vst.id + "_" + index} vst={vst} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <Separator />
      <Table className="relative ">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Tags</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {!!data?.length ? (
            data.slice(0, 5).map((vst, index) => (
              <TableRow
                className="cursor-pointer items-center"
                key={"vst_" + vst.id + "_" + index}
              >
                <TableCell>
                  <Link href={`/vsts/${vst.slug}`}>
                    <VSTHoverCard vstSlug={vst.slug}>
                      <VSTAvatar item={vst} />
                      {vst?.name}
                    </VSTHoverCard>
                  </Link>
                </TableCell>
                <TableCell className="flex flex-row flex-wrap items-center gap-2  ">
                  {vst?.tags?.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag + "_badge_" + vst?.id}
                      variant={"secondary"}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {vst?.tags?.length > 3 && (
                    <HoverCard>
                      <HoverCardTrigger>
                        <Badge className="opacity-80" variant={"secondary"}>
                          +{vst?.tags?.length - 3}
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        {
                          <div className="flex flex-row flex-wrap items-center gap-2  ">
                            {vst?.tags?.map((tag) => (
                              <Badge
                                key={tag + "_badge_" + vst?.id}
                                variant={"secondary"}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        }
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default memo(VSTTable);
