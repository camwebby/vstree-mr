import { api } from "@/utils/api";
import { SkeletonCard } from "../../organisms/skeleton-card";
import { Card, CardFooter } from "vst-ui";
import Layout from "../../organisms/layout";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  TwoColContainer,
  TwoColFirst,
  TwoColSecond,
} from "../../organisms/two-col-layout";
import { Label } from "vst-ui";
import { Switch } from "vst-ui";
import { Separator } from "vst-ui";
import CollectionVstTable from "../../organisms/collection-vst-table";
import { cn } from "vst-ui/src/lib/utils";
import CollectionMetaCard from "../../organisms/collection-meta";
import CollectionActions from "../../organisms/collection-actions";
import dynamic from "next/dynamic";

const CollectionPrices = dynamic(
  () => import("../../organisms/collection-prices"),
  {
    loading: () => <SkeletonCard />,
  },
);

const CollectionComments = dynamic(
  () => import("../../organisms/comments").then((m) => m.CollectionComments),
  {
    loading: () => <SkeletonCard />,
  },
);

export function CollectionPage({ slug }: { slug: string }) {
  const { data: collection, isLoading } = api.collection.getBySlug.useQuery({
    slug,
  });

  const { data: collectionVsts } = api.collectionVst.getByCollectionId.useQuery(
    {
      collectionId: collection?.id || -1,
    },
    {
      enabled: !!collection?.id,
      retry: false,
    },
  );

  const { data: userData } = useSession();

  const belongsToSessionUser = useMemo(() => {
    return collection?.userId === userData?.user.id;
  }, [collection, userData]);

  const [editTableMode, setEditTableMode] = useState(false);

  return (
    <Layout>
      <TwoColContainer>
        <TwoColFirst>
          {!!collection ? (
            <CollectionMetaCard
              belongsToSessionUser={belongsToSessionUser}
              collection={collection}
            />
          ) : (
            <SkeletonCard />
          )}
          <Card
            className={cn(
              editTableMode ? "ring-2 ring-primary/30 duration-300 " : "",
            )}
          >
            <CollectionVstTable
              editMode={editTableMode}
              belongsToSessionUser={belongsToSessionUser}
              collectionVsts={collectionVsts || []}
            />

            {belongsToSessionUser && (
              <>
                <Separator />

                <CardFooter>
                  <div className="mt-5 flex flex-row items-center gap-x-3">
                    <Label>Edit mode</Label>
                    <Switch
                      onCheckedChange={(v) => {
                        setEditTableMode(v);
                      }}
                      checked={editTableMode}
                    />
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        </TwoColFirst>

        <TwoColSecond>
          {!!collection ? (
            <CollectionActions
              collection={collection}
              belongsToSessionUser={belongsToSessionUser}
            />
          ) : (
            <SkeletonCard />
          )}

          <CollectionComments collectionId={collection?.id || -1} />

          <CollectionPrices collectionVsts={collectionVsts || []} />
        </TwoColSecond>
      </TwoColContainer>
    </Layout>
  );
}
