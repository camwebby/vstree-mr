import { api } from "@/utils/api";
import { H } from "highlight.run";
import { ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { CollectionVst, Vst } from "vst-database";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "vst-ui";
import { zCurrency } from "vst-utils";
import { FormattedPrice } from "./partials/formatted-price";
import { getLowestWtfByGroup } from "./utils";
import { currencyFormatter } from "@/utils/currentFormatter";

const CollectionPrices = ({
  collectionVsts,
}: {
  collectionVsts: (CollectionVst & {
    vst: Vst;
  })[];
}) => {
  const uniqueCurrencies = Object.values(zCurrency.Values);

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
                                        H.consumeError(
                                          err,
                                          `Error redirecting from collection prices to VST ${colVst.vst.slug}`,
                                        );
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
                              (getLowestWtfByGroup(currency, prices || []) ||
                                0) / 100,
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

export default memo(CollectionPrices);
