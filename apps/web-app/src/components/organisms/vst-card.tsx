import { NewCollectionContext } from "@/contexts/new-collection";
import { TNewCollectionVstItem } from "@/contexts/new-collection/types";
import { PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useContext, useState } from "react";
import { Vst } from "vst-database";
import { Badge, Button, Card, CardContent, CardHeader, Separator, toast } from "vst-ui";
import NewColWarnDialog from "./new-col-warn-dialog";
import { SkeletonCard } from "./skeleton-card";

const VSTHoverCard = dynamic(() => import("./vst-hover-card"), {
  ssr: false,
  loading: () => <SkeletonCard />,
});

export const EffectIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="37"
    height="37"
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
      clipRule="evenodd"
    />
  </svg>
);

export const InstrumentIcon = () => (
  <svg
    width="37"
    height="37"
    viewBox="0 0 35 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M33.625 10.0811L17.625 1L1.625 10.0811M33.625 10.0811L17.625 19.1622M33.625 10.0811V25.6486L17.625 34.7297M1.625 10.0811L17.625 19.1622M1.625 10.0811V25.6486L17.625 34.7297M17.625 19.1622V34.7297"
      className="stroke-foreground"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
