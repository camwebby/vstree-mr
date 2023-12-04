import { CollectionVst, Vst, WhereToFind } from "@prisma/client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "vst-ui";
import { Card, CardContent, CardHeader, CardTitle } from "vst-ui";
import { Avatar, AvatarFallback, AvatarImage } from "vst-ui";
import { SkeletonCard } from "./skeleton-card";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { currencyFormatter } from "./where-to-find";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "vst-ui";
import Link from "next/link";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";

const FormattedPrice = ({
  wtfs,
  vstId,
}: {
  wtfs: (WhereToFind | null)[];
  vstId: number;
}) => {
  const wtf = wtfs?.find((wtf) => wtf?.vstId === vstId);

  if (!wtf) {
    return <>-</>;
  }

  return (
    <div
      className={`flex flex-row items-center gap-x-2 ${
        !!wtf ? "text-primary" : "text-gray-400"
      }`}
    >
      <span>
        {!!wtf
          ? currencyFormatter(wtf.currency).format((wtf?.price || 0) / 100)
          : "N/A"}
      </span>
      <Link href={`/vsts/${vstId}`}>
        <OpenInNewWindowIcon />
      </Link>
    </div>
  );
};

const CollectionPrices = ({
  collectionVsts,
}: {
  collectionVsts: (CollectionVst & {
    vst: Vst;
  })[];
}) => {
  const {
    data: prices,
    isLoading,
    isFetching,
  } = api.collection.findPrices.useQuery({
    vstIds: collectionVsts?.map((vst) => vst.vstId) || [],
    mode: "lowest",
  });

  const uniqueCurrencies = ["USD", "EUR", "GBP"];

  const totalLowestPrice = prices?.reduce(
    (acc: number, curr) => acc + (curr.price || 0),
    0,
  );

  const router = useRouter();

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Price compare</CardTitle>
      </CardHeader>
      <CardContent className="">
        <Tabs defaultValue={uniqueCurrencies[0]} className="">
          <TabsList className="grid w-full grid-cols-2">
            {uniqueCurrencies.map((currency) => (
              <TabsTrigger key={currency + "_trigger"} value={currency}>
                {currency}
              </TabsTrigger>
            ))}
          </TabsList>
          {uniqueCurrencies.map((currency) => (
            <TabsContent key={currency} value={currency}>
              {!!collectionVsts?.length || !!isFetching ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vst</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {collectionVsts.map((colVst) => (
                      <TableRow key={colVst.vst.id}>
                        <TableCell className="flex flex-row items-center gap-x-3">
                          <Avatar
                            className="cursor-pointer transition-opacity duration-300 hover:opacity-80"
                            onClick={() => {
                              router
                                .push(`/vsts/${colVst.vst.slug}`)
                                .catch((err) => {
                                  // TODO: handle error
                                });
                            }}
                          >
                            <AvatarImage
                              src={colVst.vst.iconUrl || ""}
                              width={100}
                              height={100}
                              className="object-cover"
                              alt={colVst.vst.name}
                            />

                            <AvatarFallback>
                              {colVst.vst.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {colVst.vst.name}
                        </TableCell>
                        <TableCell>
                          <FormattedPrice
                            wtfs={
                              prices
                                ?.filter((p) => !p)
                                .filter(
                                  (price) => price?.currency === currency,
                                ) || []
                            }
                            vstId={colVst.vstId}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell>Total</TableCell>
                      <TableCell>~&nbsp; {totalLowestPrice}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              ) : (
                <SkeletonCard />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CollectionPrices;
