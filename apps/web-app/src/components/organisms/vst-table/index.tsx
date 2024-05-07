import { memo } from "react";
import { Vst } from "vst-database";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
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
import { VstCard } from "../vst-card";
import VSTTableRowItem from "./partials/row-item";

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
            data
              .slice(0, 5)
              .map((vst, index) => (
                <VSTTableRowItem
                  key={"vst_" + vst.id + "_" + index}
                  vst={vst}
                />
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
