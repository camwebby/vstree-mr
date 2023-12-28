import React from "react";
import { api } from "@/utils/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "vst-ui";
import { Separator } from "vst-ui";
import { Skeleton } from "vst-ui";
import {
  vstStatIconMap,
  vstToggleToCount,
  vstUserAction,
} from "@/constants/vstUserAction";
import { Loader2, PlusIcon } from "lucide-react";
import { useContext } from "react";
import { NewCollectionContext } from "@/contexts/new-collection";
import { Button } from "vst-ui";
import { useVstToggle } from "@/utils/useVstToggle";
import { User, Vst } from "@prisma/client";
import { TNewCollectionVstItem } from "@/contexts/new-collection/types";
import { Badge } from "vst-ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "vst-ui";
import { toast } from "vst-ui";
import ExperienceRateDialog from "./compatibility-rate";
import { useSession } from "next-auth/react";

const VSTActions = ({
  vst,
  setShowWarnDialog,
}: {
  vst?: Vst;
  setShowWarnDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: userVst, isLoading: isLoadingUserVst } =
    api.userVst.getByVstId.useQuery(
      {
        vstId: vst?.id || -1,
      },
      {
        enabled: !!vst?.id,
        retry: false,
      },
    );

  const { mutate, isLoading } = useVstToggle({ vst: vst as Vst });

  const {
    form,
    setMinimized,
    showNewCollectionForm,
    setShowNewCollectionForm,
  } = useContext(NewCollectionContext);

  const { data: session } = useSession();

  const { data: userData } = api.user.getUserPublic.useQuery({
    userId: session?.user?.id || "",
  });

  return (
    <>
      <Card className="">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        {/* <Separator /> */}

        {!isLoadingUserVst ? (
          <CardContent className="mt-5 flex gap-5">
            {!!vst ? (
              (
                Object.keys(vstUserAction) as Array<keyof typeof vstUserAction>
              ).map((key) => {
                if (!vst) return null;

                const stat = vstToggleToCount[vstUserAction[key]];

                return (
                  <TooltipProvider key={key + vst.id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          onClick={() => {
                            mutate({
                              vstId: vst.id,
                              stat: vstUserAction[key],
                            });
                          }}
                          disabled={isLoading}
                          size="icon"
                          variant={"outline"}
                          key={key + vst.id}
                          className="relative flex flex-row items-center gap-2 border-2"
                        >
                          <>
                            <Badge
                              variant={"secondary"}
                              className="absolute -right-4 -top-3 border-2"
                            >
                              {vst[stat]}
                            </Badge>
                            {
                              vstStatIconMap[key]?.[
                                !!userVst && userVst[vstUserAction[key]]
                                  ? "checked"
                                  : "unchecked"
                              ]
                            }
                          </>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{key}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })
            ) : (
              <>
                <Skeleton className="my-1 h-5 w-full" />
                <Skeleton className="mb-1 h-5 w-full" />
              </>
            )}
          </CardContent>
        ) : (
          <Loader2 className="mx-auto my-5 h-5 w-5 animate-spin text-muted-foreground" />
        )}
        <Separator />

        <CardFooter className="mt-5 flex-wrap flex flex-row items-center gap-2 whitespace-nowrap">
          <Button

            onClick={() => {
              // If form is open, show warn dialog
              if (showNewCollectionForm) {
                setShowWarnDialog(true);
              }
              // If form is closed, open form
              else {
                setShowNewCollectionForm(true);
                form.setValue("vsts", [
                  ...(form.getValues("vsts") ?? []),
                  {
                    ...vst,
                    tempId: crypto.randomUUID(),
                  } as unknown as TNewCollectionVstItem,
                ]);
                toast({
                  title: "Added to new collection",
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
              }
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4 " /> Create collection
          </Button>

          {showNewCollectionForm && vst && (
            <Button
              variant={"secondary"}
              onClick={() => {
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
            >
              <PlusIcon className="mr-2 h-4 w-4 " /> Add to{" "}
              {form.getValues("collectionName") || "Collection"}
            </Button>
          )}

          {userData && (
            <ExperienceRateDialog
              userData={userData as unknown as User}
              vstId={vst?.id || -1}
            />
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default VSTActions;
