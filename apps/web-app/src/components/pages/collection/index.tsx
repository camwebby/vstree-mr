import { api } from "@/utils/api";
import { SkeletonCard } from "../../molecules/skeleton-card";
import { Card, CardFooter, ToggleGroup, ToggleGroupItem } from "vst-ui";
import Layout from "@/components/layout/primary";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  TwoColContainer,
  TwoColFirst,
  TwoColSecond,
} from "../../layout/two-col-layout";
import { Label } from "vst-ui";
import { Switch } from "vst-ui";
import { Separator } from "vst-ui";
import CollectionVstTable from "../../organisms/collection-vst-table";
import { cn } from "vst-ui/src/lib/utils";
import CollectionMetaCard from "../../organisms/collection-meta";
import CollectionActions from "../../organisms/collection-actions";
import dynamic from "next/dynamic";
import { vstStatIconMap, vstUserAction } from "@/constants/vst-user-action";
import Head from "next/head";
import { appConfig } from "@/constants/app-config";

// #region dynamic imports
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
// #endregion

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

  // #region associations
  const [showAssociations, setShowAssociations] = useState<
    (typeof vstUserAction)[keyof typeof vstUserAction][]
  >([]);

  const { data: userVsts } = api.userVst.getByUserId.useQuery(
    {
      userId: userData?.user.id || "",
    },
    {
      enabled: !!userData?.user.id && !!showAssociations?.length,
    },
  );
  // #endregion

  return (
    <Layout>
      <Head>
        <title>{collection?.name || "Collection"} | {appConfig.appName}</title>
      </Head>
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
              showAssociations={showAssociations}
              belongsToSessionUser={belongsToSessionUser}
              collectionVsts={collectionVsts || []}
              userVsts={userVsts || []}
            />

            {belongsToSessionUser && (
              <>
                <Separator />

                <CardFooter className="justify-start gap-x-8">
                  <div className="mt-5 flex flex-row items-center gap-x-2">
                    <Label>Edit mode</Label>
                    <Switch
                      onCheckedChange={(v) => {
                        setEditTableMode(v);
                      }}
                      checked={editTableMode}
                    />
                  </div>

                  <div className="mt-5 flex flex-row items-center gap-x-2">
                    <Label>Show</Label>
                    <ToggleGroup
                      type="multiple"
                      onValueChange={(v) => {
                        setShowAssociations(
                          v as (typeof vstUserAction)[keyof typeof vstUserAction][],
                        );
                      }}
                    >
                      {Object.keys(vstUserAction).map((ua) => (
                        <ToggleGroupItem value={vstUserAction[ua]}>
                          {vstStatIconMap[ua].unchecked}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
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
