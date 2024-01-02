import { VstCard } from "@/components/organisms/vst-card";
import { api } from "@/utils/api";
import { SkeletonCard } from "../organisms/skeleton-card";
import { useEffect, useState } from "react";
import { tags } from "@/constants/tags";
import { Badge, Button } from "vst-ui";
import { Loader2Icon, SidebarCloseIcon, XCircle } from "lucide-react";
import ComboBoxSelect from "../organisms/combo-select";
import { cn } from "vst-ui/src/lib/utils";
import { toast } from "vst-ui";
import { creators } from "@/constants/creators";
import { useRouter } from "next/router";
import { Checkbox } from "vst-ui";
import Head from "next/head";

export function Vsts({
  initialData,
}: {
  initialData?: ReturnType<typeof api.vsts.getAllPaginated.useInfiniteQuery>;
}) {
  // Get query
  const {
    query: { creatorsFilter, tagsFilter },
  } = useRouter();

  // const [searchVal, setSearchVal] = useState("");
  // const [debouncedSearch] = useDebouncedValue(searchVal, 350);

  const [selectedTags, setSelectedTags] = useState<(typeof tags)[number][]>([]);
  const [selectedCreators, setSelectedCreators] = useState<
    (typeof creators)[number][]
  >(
    // parse from query
    !!creatorsFilter ? creatorsFilter.toString().split(",") : [],
  );

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
        // search: debouncedSearch,
        types,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // initialData: initialData,
      },
    );

  const showTabBar = !!selectedCreators?.length || !!selectedTags?.length;

  return (
    <div className="relative">
      <Head>
        <title>vsts | vstree</title>
      </Head>
      <div
        className={cn(
          "max-w-screen sticky top-0 z-10 flex items-center gap-5 overflow-x-auto border-l border-border bg-background/60 p-3 backdrop-blur-sm lg:border-b",
          !showTabBar ? "mb-5" : "mb-0",
        )}
      >
        <ComboBoxSelect
          values={selectedCreators}
          setValues={(values) => {
            setSelectedCreators(values);
          }}
          allOptions={creators.sort((a, b) => a.localeCompare(b))}
          optionLabel="creator"
        />

        <ComboBoxSelect
          values={selectedTags}
          setValues={(values) => {
            setSelectedTags(values);
          }}
          allOptions={tags.sort((a, b) => a.localeCompare(b))}
          optionLabel="tag"
        />

        <div className="flex items-center space-x-2 rounded border border-border p-2">
          <Checkbox
            disabled={types[0] && !types[1]}
            checked={types[0]}
            onCheckedChange={(v) => {
              setTypes([true, !types.every(Boolean)]);
            }}
            id="effects"
          />
          <label
            htmlFor="effects"
            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Effects
          </label>
          <Checkbox
            disabled={types[1] && !types[0]}
            checked={types[1]}
            onCheckedChange={(v) => {
              setTypes([!types.every(Boolean), true]);
            }}
            id="instruments"
          />
          <label
            htmlFor="instruments"
            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Instruments
          </label>
        </div>
      </div>

      {showTabBar && (
        <div
          className={cn(
            "max-w-screen sticky top-0 z-10 mb-5 flex items-center gap-2 overflow-x-auto border-l border-border bg-background/90 p-3 backdrop-blur-sm lg:border-b",
          )}
        >
          {!!selectedCreators?.length && (
            <>
              <p className="text-xs font-medium leading-none">Creators</p>
              <div className="flex gap-x-2">
                {selectedCreators.map((tag) => (
                  <button
                    onClick={() => {
                      setSelectedCreators((prev) =>
                        prev.filter((t) => t !== tag),
                      );
                    }}
                    key={tag}
                  >
                    <Badge
                      variant="secondary"
                      className="group flex shrink-0 items-center gap-x-1"
                    >
                      <span>{tag}</span>
                      <XCircle className="hidden h-3 w-3 group-hover:flex" />
                    </Badge>
                  </button>
                ))}
              </div>
            </>
          )}

          {!!selectedTags?.length && (
            <>
              <p className="ml-2 text-xs font-medium leading-none">Tags</p>
              <div className="flex gap-x-2">
                {selectedTags.map((tag) => (
                  <button
                    onClick={() => {
                      setSelectedTags((prev) => prev.filter((t) => t !== tag));
                    }}
                    key={tag}
                  >
                    <Badge
                      variant="secondary"
                      className="group flex shrink-0 items-center gap-x-1"
                    >
                      <span>{tag}</span>
                      <XCircle className="hidden h-3 w-3 group-hover:flex" />
                    </Badge>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 px-4 md:grid-cols-2 lg:px-7 2xl:grid-cols-3">
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
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
