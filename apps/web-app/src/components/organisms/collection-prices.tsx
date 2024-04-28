import { CollectionVst, Vst, WhereToFind } from "vst-database";
import React, { useCallback, useState } from "react";
import {
  Button,
  CardDescription,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "vst-ui";
import { Card, CardContent, CardHeader, CardTitle } from "vst-ui";
import { Avatar, AvatarFallback, AvatarImage } from "vst-ui";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { currencyFormatter } from "./where-to-find";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "vst-ui";
import Link from "next/link";
import { OpenInNewWindowIcon } from "vst-ui";
import { ChevronDown, Loader2 } from "lucide-react";

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
        !!wtf ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      <span>
        {!!wtf
          ? currencyFormatter(wtf.currency).format((wtf?.price || 0) / 100)
          : "N/A"}
      </span>
      <Link rel="noopener noreferrer" target="_blank" href={wtf.url}>
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
  const [cardOpen, setCardOpen] = useState(false);

  const { data: prices, isFetching } = api.collection.findPrices.useQuery(
    {
      vstIds: collectionVsts?.map((vst) => vst.vstId) || [],
      mode: "lowest",
    },
    {
      enabled: !!collectionVsts?.length && !!cardOpen,
    },
  );

  const uniqueCurrencies = ["USD", "EUR", "GBP"];

  const totalLowestPrice = useCallback(
    (currency: string, prices: WhereToFind[]): number => {
      if (!prices?.length) {
        return 0;
      }

      return (
        prices?.reduce((acc: number, curr) => {
          if (curr.currency === currency) {
            return acc + (curr.price ?? 0);
          }
          return acc;
        }, 0) ?? 0
      );
    },
    [],
  );

  const router = useRouter();

  return (
    <Collapsible onOpenChange={(v) => setCardOpen(v)}>
      <Card className="">
        <CollapsibleTrigger>
          <CardHeader className="flex w-full flex-row items-center justify-between gap-x-2">
            <div className="text-left">
              <CardTitle className="mb-2">Price compare</CardTitle>
              <CardDescription>
                The lowest price for each VST in your collection
              </CardDescription>
            </div>
            <div className="flex-grow" />
            <ChevronDown
              className={`h-4 w-4 transform transition-transform ${
                cardOpen ? "rotate-180" : ""
              }`}
            />
            <span className="sr-only">Toggle</span>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="">
            <Tabs defaultValue={uniqueCurrencies[0]} className="">
              <TabsList className="">
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
                      <TableCaption>
                        *Prices are not guaranteed to be accurate
                      </TableCaption>
                      <TableHeader>
                        <TableRow
                          className="w-full text-sm text-muted-foreground"
                          key="header"
                        >
                          <TableCell>Vst</TableCell>
                          <TableCell>Price</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {collectionVsts
                          .filter(
                            (vst, index, self) =>
                              self.findIndex((v) => v.vstId === vst.vstId) ===
                              index,
                          )
                          .map((colVst) => (
                            <TableRow key={colVst.id}>
                              <TableCell className="flex flex-row items-center gap-x-3">
                                <Avatar
                                  onClick={() => {
                                    router
                                      .push(`/vsts/${colVst.vst.slug}`)
                                      .catch((err) => {
                                        // TODO: handle error
                                      });
                                  }}
                                  className="cursor-pointer transition-opacity duration-300 hover:opacity-80"
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
                                      ?.filter((p) => !!p)
                                      .filter((p) => p.currency === currency) ||
                                    []
                                  }
                                  vstId={colVst.vstId}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      <TableFooter className="border-t bg-background text-sm text-foreground">
                        <TableRow>
                          <TableCell>Total</TableCell>
                          <TableCell>
                            ~&nbsp;
                            {currencyFormatter(currency).format(
                              (totalLowestPrice(currency, prices || []) || 0) /
                                100,
                            )}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  ) : (
                    <Loader2 className="mx-auto my-5 h-5 w-5 animate-spin text-muted-foreground" />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CollectionPrices;
