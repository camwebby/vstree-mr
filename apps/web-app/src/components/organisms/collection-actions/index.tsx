import { Badge } from "vst-ui";
import { Button } from "vst-ui";
import { Card, CardContent, CardHeader, CardTitle } from "vst-ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "vst-ui";
import {
  collectionStatIconMap,
  collectionToggleToCount,
  collectionUserAction,
} from "@/constants/collectionUserAction";
import { Collection } from "vst-database";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "vst-ui";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { toast } from "vst-ui";
import { useClipboard } from "@mantine/hooks";
import { ShareIcon } from "lucide-react";

const CollectionActions: React.FC<{
  collection: Collection;
  belongsToSessionUser: boolean;
}> = ({ ...props }) => {
  const apiContext = api.useContext();

  const router = useRouter();

  const { data: userCollection, isLoading: isLoadingUserVst } =
    api.userCollection.getByCollectionId.useQuery(
      {
        collectionId: props.collection?.id || -1,
      },
      {
        enabled: !!props.collection?.id,
        retry: false,
      },
    );

  const { mutate: toggleStat, isLoading: toggleLoading } =
    api.userCollection.toggleStat.useMutation({
      onSuccess: async () => {
        await apiContext.collection.getBySlug.invalidate({
          slug: props.collection.slug ?? "",
        });

        await apiContext.userCollection.getByCollectionId.invalidate({
          collectionId: props.collection?.id || -1,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate: deleteCollection } = api.collection.delete.useMutation({
    onSuccess: async () => {
      await apiContext.collection.getBySlug.invalidate({
        slug: props.collection.slug ?? "",
      });

      await apiContext.collection.getAll.invalidate();

      // redirect to /collections
      await router.push("/collections");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const clipboard = useClipboard({ timeout: 500 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-row items-center gap-4">
          {(
            Object.keys(collectionUserAction) as Array<
              keyof typeof collectionUserAction
            >
          ).map((key) => {
            if (!props.collection) return null;

            const stat = collectionToggleToCount[collectionUserAction[key]];

            return (
              <TooltipProvider key={key + props.collection.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() => {
                        toggleStat({
                          collectionId: props.collection.id,
                          stat: collectionUserAction[key],
                        });
                      }}
                      disabled={toggleLoading}
                      size="icon"
                      variant={"outline"}
                      key={key + props.collection.id}
                      className="relative flex flex-row items-center gap-2 border-2"
                    >
                      <>
                        <Badge
                          variant={"outline"}
                          className="absolute -right-4 -top-3 border-2 bg-background"
                        >
                          {props.collection[stat]}
                        </Badge>
                        {
                          collectionStatIconMap[key]?.[
                            !!userCollection &&
                            userCollection[collectionUserAction[key]]
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
          })}

          {!props.collection.private && (
            <button
              onClick={() => {
                clipboard.copy(
                  `${window.location.origin}/collections/${props.collection?.slug}`,
                );

                toast({
                  title: "Sharable link copied to clipboard",
                });
              }}
              className="rounded border-2 border-border p-2"
            >
              <ShareIcon className="text-foreground duration-300 hover:text-muted-foreground" />
            </button>
          )}
        </div>

        {props.belongsToSessionUser && (
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive" className="mt-5">
                Delete collection
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteCollection({
                      id: props.collection?.id || -1,
                    });
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};

export default CollectionActions;
