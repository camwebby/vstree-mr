import { Card, CardHeader, CardTitle } from "vst-ui";
import { Separator } from "vst-ui";
import { Button } from "vst-ui";
import VSTAvatar from "./vst-avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "vst-ui";
import { Badge } from "vst-ui";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "vst-ui";
import Link from "next/link";
import { Vst } from "vst-database";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "vst-ui";
import { VstCard } from "./vst-card";
import dynamic from "next/dynamic";
import { SkeletonCard } from "./skeleton-card";

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

export default VSTTable;
