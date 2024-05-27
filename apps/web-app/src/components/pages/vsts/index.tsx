import Layout from "@/components/layout/primary";
import { VstCard } from "@/components/organisms/vst-card";
import { creators } from "@/constants/creators";
import { tags } from "@/constants/tags";
import { api } from "@/utils/api";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Button, toast } from "vst-ui";
import { SkeletonCard } from "../../molecules/skeleton-card";
import VstFilterBar from "./partials/filter-bar";
import VstFilterList from "./partials/filters-list";

export function Vsts({}: {
  initialData?: ReturnType<typeof api.vsts.getAllPaginated.useInfiniteQuery>;
}) {
  const {
    query: { creatorsFilter, tagsFilter },
  } = useRouter();

  const [selectedTags, setSelectedTags] = useState<(typeof tags)[number][]>([]);
  const [selectedCreators, setSelectedCreators] = useState<
    (typeof creators)[number][]
  >(!!creatorsFilter ? creatorsFilter.toString().split(",") : []);

  const [selectedVstTypes, setSelectedVstTypes] = useState<[boolean, boolean]>([
    true,
    true,
  ]);
  const [_, setPage] = useState(0);
  const [orderBy] = useState<"createdAt" | "updatedAt" | "countLikes">(
    "countLikes",
  );

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
        types: selectedVstTypes,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const showTabBar = useMemo(
    () => !!selectedCreators?.length || !!selectedTags?.length,
    [selectedCreators, selectedTags],
  );

  return (
    <Layout>
      <div className="relative">
        <VstFilterBar
          {...{
            showTabBar,
            selectedTags,
            setSelectedTags,
            selectedCreators,
            setSelectedCreators,
            selectedVstTypes,
            setSelectedVstTypes,
          }}
        />

        {showTabBar && (
          <VstFilterList
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
    </Layout>
  );
}
