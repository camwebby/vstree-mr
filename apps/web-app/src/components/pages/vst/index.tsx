import { api } from "@/utils/api";
import { SkeletonCard } from "../../organisms/skeleton-card";
import { Card, CardContent, CardFooter, Skeleton } from "vst-ui";
import Layout from "../../organisms/layout";
import { Separator } from "vst-ui";
import { FactoryIcon } from "lucide-react";
import { useState } from "react";
import {
  TwoColContainer,
  TwoColFirst,
  TwoColSecond,
} from "../../organisms/two-col-layout";
import VSTAvatar from "../../organisms/vst-avatar";
import { VstComments } from "../../organisms/comments";
import NewColWarnDialog from "../../organisms/new-col-warn-dialog";
import { Vst } from "vst-database";
import { Badge } from "vst-ui";
import Link from "next/link";
import dynamic from "next/dynamic";
import Head from "next/head";

// #region Dynamic Imports
const VSTActions = dynamic(() => import("../../organisms/vst-actions"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});
const WhereToFinds = dynamic(() => import("../../organisms/where-to-find"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});
const VSTTable = dynamic(() => import("../../organisms/vst-table"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});
const CompatibilityHeatmap = dynamic(
  () => import("../../organisms/compatibility-heatmap"),
);
// #endregion

export function VstPage({ slug }: { slug: string }) {
  const { data: vst, isLoading } = api.vsts.getBySlug.useQuery({
    slug,
  });

  const [showWarnDialog, setShowWarnDialog] = useState(false);

  const { data: relatedVsts, isLoading: isLoadingRelatedVsts } =
    api.vsts.getByTags.useQuery(
      {
        tags: vst?.tags || [],
      },
      {
        enabled: !!vst?.tags?.length,
      },
    );

  return (
    <Layout>
      <>
        <Head>
          <title>{vst?.name} | vstree</title>
        </Head>
        <NewColWarnDialog
          isOpen={showWarnDialog}
          onOpenChange={setShowWarnDialog}
        />

        <section className="w-full border-b border-l border-border bg-background px-8 py-20">
          <div className="mx-auto flex items-center gap-5 text-primary">
            <VSTAvatar className="h-20 w-20 rounded-md" item={vst as Vst} />
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="mb-2 h-5 w-52" />
                  <Skeleton className="h-5 w-32" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-foreground">
                    {vst?.name}
                  </h1>
                  <Link
                    href={`/?creatorsFilter=${vst?.creatorName}`}
                    className="flex items-end gap-x-3 pt-1 text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                    <FactoryIcon
                      className="h-5 w-5 text-muted-foreground"
                      strokeWidth={1}
                    />
                    <span className="text-sm text-muted-foreground">
                      {vst?.creatorName}
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
        <TwoColContainer>
          <TwoColFirst>
            <Card className="h-fit">
              <CardContent className="mt-8 text-sm text-muted-foreground">
                <CompatibilityHeatmap vstId={vst?.id || -1} />
              </CardContent>
              <Separator />
              <CardFooter className="flex flex-row flex-wrap items-center gap-2 pt-5">
                {vst?.tags?.map((tag) => (
                  <Badge variant={"secondary"} key={tag + "_tag_" + vst?.id}>
                    {tag}
                  </Badge>
                ))}

                <div />
              </CardFooter>
            </Card>

            {!!relatedVsts?.length && (
              <VSTTable data={relatedVsts} title="Similar VSTs" />
            )}
          </TwoColFirst>

          <TwoColSecond>
            <VSTActions
              vst={vst as Vst | undefined}
              {...{ setShowWarnDialog }}
            />

            <WhereToFinds
              vstId={vst?.id || -1}
              data={vst?.whereToFinds.filter((wtf) => wtf.price !== null) || []}
            />
            <VstComments vstId={vst?.id} />
          </TwoColSecond>
        </TwoColContainer>
      </>
    </Layout>
  );
}
