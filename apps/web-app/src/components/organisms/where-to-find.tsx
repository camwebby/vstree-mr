import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "vst-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "vst-ui";
import type { WhereToFind } from "vst-database";
import Link from "next/link";
import { useCallback } from "react";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "vst-ui";
import { OpenInNewWindowIcon } from "vst-ui";
import dynamic from "next/dynamic";
const WTFSuggest = dynamic(() => import("./wtf-suggest"));

export const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

const WhereToFinds = ({
  data,
  vstId,
}: {
  data: WhereToFind[];
  vstId: number;
}) => {
  const uniqueCurrencies = data
    .map((whereToFind) => {
      return whereToFind.currency;
    })
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

  const itemsByCurrency = useCallback(
    (currency: string) => {
      return data.filter((whereToFind) => {
        return whereToFind.currency === currency;
      });
    },
    [uniqueCurrencies],
  );

  return (
    <>
      {}
      <Card>
        <CardHeader>
          <CardTitle>Where to find</CardTitle>
        </CardHeader>
        <CardContent>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Vendor</TableHead>
                      <TableHead>Last updated</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  {itemsByCurrency(currency).map((whereToFind) => {
                    return (
                      <TableRow key={whereToFind.id}>
                        <TableCell className="min-w-[180px] ">
                          <Link
                            rel="noopener noreferrer"
                            target="_blank"
                            href={whereToFind.url}
                            className="flex items-center gap-x-2 underline"
                          >
                            {whereToFind.vendorName}
                            <OpenInNewWindowIcon />
                          </Link>
                        </TableCell>
                        <TableCell>
                          {new Date(whereToFind.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {whereToFind.price === 0 || whereToFind.price === null
                            ? "Free"
                            : currencyFormatter(whereToFind.currency).format(
                                whereToFind?.price / 100,
                              )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Know of a place to find this VST?{" "}
          </p>
          <WTFSuggest vstId={vstId} />
        </CardFooter>
      </Card>
    </>
  );
};

export default WhereToFinds;
