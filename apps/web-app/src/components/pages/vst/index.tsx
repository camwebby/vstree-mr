import { api } from "@/utils/api";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import { Vst } from "vst-database";
import { Badge, Card, CardContent, CardFooter, Separator } from "vst-ui";
import { VstComments } from "../../organisms/comments";
import Layout from "@/components/layout/primary";
import NewColWarnDialog from "../../molecules/new-col-warn-dialog";
import { SkeletonCard } from "../../molecules/skeleton-card";
import {
  TwoColContainer,
  TwoColFirst,
  TwoColSecond,
} from "../../layout/two-col-layout";
import VSTHeader from "./partials/vst-header";
import Link from "next/link";

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

  const { data: relatedVsts } = api.vsts.getByTags.useQuery(
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

        <VSTHeader vst={vst} isLoading={isLoading} />
        <TwoColContainer>
          <TwoColFirst>
            <Card className="h-fit">
              <CardContent className="mt-8 text-sm text-muted-foreground">
                <CompatibilityHeatmap vstId={vst?.id || -1} />
              </CardContent>
              <Separator />
              <CardFooter className="flex flex-row flex-wrap items-center gap-2 pt-5">
                {vst?.tags?.map((tag) => (
                  <Link href={`/?tagsFilter=${tag}`}>
                    <Badge variant={"secondary"} key={tag + "_tag_" + vst?.id}>
                      {tag}
                    </Badge>
                  </Link>
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
