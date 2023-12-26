import { api } from "@/utils/api";
import { CollectionCard } from "../../organisms/collection-card";
import { useState } from "react";
import { cn } from "vst-ui/src/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "vst-ui";
import { sortOptions } from "./consts";


export function Collections() {
  const [orderBy, setOrderBy] = useState<(typeof sortOptions)[number]["value"]>(
    sortOptions[0].value,
  );

  const {
    data,
    // isLoading, fetchNextPage, hasNextPage
  } = api.collection.getAll.useInfiniteQuery(
    {
      limit: 1000,
      orderBy,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <>
      <div
        className={cn(
          "max-w-screen sticky top-0 z-10 mb-5 flex items-center gap-5 overflow-x-auto border-l border-border bg-background/60 p-3 backdrop-blur-sm lg:border-b",
        )}
      >
        <Select
          onValueChange={(v: (typeof sortOptions)[number]["value"]) => {
            setOrderBy(v);
          }}
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue
              placeholder={sortOptions.find((o) => o.value === orderBy)?.label}
            />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <>
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              </>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-2 2xl:grid-cols-3">
        {data?.pages
          .flatMap((page) => page.items)
          .map((collection) => {
            return <CollectionCard key={collection.id} {...collection} />;
          })}
      </div>
    </>
  );
}
