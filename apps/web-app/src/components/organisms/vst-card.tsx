import { NewCollectionContext } from "@/contexts/new-collection";
import { TNewCollectionVstItem } from "@/contexts/new-collection/types";
import { PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useContext, useState } from "react";
import { Vst } from "vst-database";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Separator,
  toast,
} from "vst-ui";
import { EffectIcon, InstrumentIcon } from "vst-ui/src/assets";
import NewColWarnDialog from "../molecules/new-col-warn-dialog";
import { SkeletonCard } from "../molecules/skeleton-card";

const VSTHoverCard = dynamic(() => import("./vst-hover-card"), {
  ssr: false,
  loading: () => <SkeletonCard />,
});

export const VstCard: React.FC<{ vst: Vst }> = ({ vst }) => {
  const {
    form,
    setMinimized,
    showNewCollectionForm,
    setShowNewCollectionForm,
  } = useContext(NewCollectionContext);

  const [showWarnDialog, setShowWarnDialog] = useState(false);

  const maxTags = 2;

  return (
    <>
      <NewColWarnDialog
        isOpen={showWarnDialog}
        onOpenChange={setShowWarnDialog}
      />

      <Link href={`/vsts/${vst.slug}`}>
        <VSTHoverCard vstSlug={vst.slug}>
          <Card
            className="
          h-full w-full hover:ring hover:ring-ring"
          >
            <CardHeader className="relative flex flex-row items-center gap-x-3">
              <>
                {vst.isInstrument ? <InstrumentIcon /> : <EffectIcon />}
                <div>
                  <div className="flex items-center gap-x-2 text-xs text-muted-foreground">
                    <p className="text-xs text-muted-foreground">
                      {vst.creatorName}
                    </p>
                  </div>
                  <p className="text-xl text-foreground">{vst?.name}</p>
                </div>
              </>

              {showNewCollectionForm && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();

                    e.preventDefault();

                    form.setValue("vsts", [
                      ...(form.getValues("vsts") ?? []),
                      {
                        ...vst,
                        tempId: crypto.randomUUID(),
                      } as unknown as TNewCollectionVstItem,
                    ]);

                    toast({
                      title: `Added ${vst.name} to ${
                        form.getValues("collectionName") || "Collection"
                      }`,
                      description: (
                        <Button
                          size="sm"
                          onClick={() => {
                            setMinimized(false);
                            setShowNewCollectionForm(true);
                          }}
                        >
                          View collection
                        </Button>
                      ),
                    });
                  }}
                  variant={"ghost"}
                  className="group absolute right-0 top-0"
                >
                  <PlusCircle className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-y-5 pl-[72px] ">
              <div className="flex flex-row flex-wrap gap-2">
                {vst?.tags?.slice(0, 3)?.map((tag) => (
                  <Badge
                    variant={"secondary"}
                    key={tag + "_tag_" + vst?.id}
                    className=""
                  >
                    {tag}
                  </Badge>
                ))}
                {vst?.tags?.length > maxTags && (
                  <Badge
                    variant={"secondary"}
                    key={vst?.id + "_tag_more"}
                    className=""
                  >
                    +{vst?.tags?.length - maxTags} more
                  </Badge>
                )}
                {vst?.tags?.length === 0 && (
                  <p className="text-xs text-muted-foreground">No tags</p>
                )}
              </div>

              <Separator />

              <div className="flex flex-row  gap-x-5">
                <div className="flex flex-row items-center gap-x-1">
                  <p className="text-xs text-muted-foreground">Likes</p>
                  <p>{vst.countLikes}</p>
                </div>
                <div className="flex flex-row items-center gap-x-1">
                  <p className="text-xs text-muted-foreground">Owns</p>
                  <p>{vst.countOwns}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </VSTHoverCard>
      </Link>
    </>
  );
};
