import { VstCard } from "@/components/organisms/vst-card";
import { api } from "@/utils/api";
import { SkeletonCard } from "../../organisms/skeleton-card";
import { useEffect, useState } from "react";
import { tags } from "@/constants/tags";
import { Badge, Button } from "vst-ui";
import { Loader2Icon, XCircle } from "lucide-react";
import { cn } from "vst-ui/src/lib/utils";
import { toast } from "vst-ui";
import { creators } from "@/constants/creators";
import { useRouter } from "next/router";
import Head from "next/head";
import FilterBar from "./partials/filter-bar";
import FilterTabBar from "./partials/filter-tab-bar";

export function Vsts({
  initialData,
}: {
  initialData?: ReturnType<typeof api.vsts.getAllPaginated.useInfiniteQuery>;
}) {
  const {
    query: { creatorsFilter, tagsFilter },
  } = useRouter();

  const [selectedTags, setSelectedTags] = useState<(typeof tags)[number][]>([]);
  const [selectedCreators, setSelectedCreators] = useState<
    (typeof creators)[number][]
  >(!!creatorsFilter ? creatorsFilter.toString().split(",") : []);

  const [types, setTypes] = useState<[boolean, boolean]>([true, true]);

  const [_, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState<
    "createdAt" | "updatedAt" | "countLikes"
  >("countLikes");

  useEffect(() => {
    if (!creatorsFilter) return;
    setSelectedCreators(creatorsFilter.toString().split(","));
  }, [creatorsFilter]);

  useEffect(() => {
    if (!tagsFilter) return;
    setSelectedTags(tagsFilter.toString().split(","));
  }, [tagsFilter]);

  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } =
    api.vsts.getAllPaginated.useInfiniteQuery(
      {
        limit: 21,
        orderBy,
        tags: selectedTags,
        creators: selectedCreators,
        types,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const showTabBar = !!selectedCreators?.length || !!selectedTags?.length;

  return (
    <div className="relative">
      <Head>
        <title>vsts | vstree</title>
      </Head>

      <FilterBar
        {...{
          showTabBar,
          selectedTags,
          setSelectedTags,
          selectedCreators,
          setSelectedCreators,
          types,
          setTypes,
          orderBy,
        }}
      />

      {showTabBar && (
        <FilterTabBar
          {...{
            selectedCreators,
            setSelectedCreators,
            selectedTags,
            setSelectedTags,
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-5 px-4 md:grid-cols-2 lg:px-7 2xl:grid-cols-3">
        {isLoading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard />
            ))}
          </>
        )}
        {data?.pages
          .flatMap((page) => page.items)
          .map((vst) => <VstCard key={vst.id} vst={vst} />)}
      </div>

      {hasNextPage && (
        <div className="my-10 flex w-full items-center justify-center">
          {!isFetching ? (
            <Button
              className="bg-primary"
              disabled={isFetching}
              onClick={async () => {
                await fetchNextPage().catch((e) =>
                  toast({
                    title: "Error",
                    variant: "destructive",
                  }),
                );
                setPage((prev) => prev + 1);
              }}
            >
              Load more
            </Button>
          ) : (
            <Loader2Icon className="h-10 w-10 animate-spin text-primary/40" />
          )}
        </div>
      )}
    </div>
  );
}
