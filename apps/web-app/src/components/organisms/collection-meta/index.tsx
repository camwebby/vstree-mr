import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
} from "vst-ui";
import { Avatar, AvatarFallback, AvatarImage } from "vst-ui";
import { useState } from "react";
import { Label } from "vst-ui";
import { Separator } from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";
import { Input } from "vst-ui";
import { Textarea } from "vst-ui";
import UpdateImageDialog from "@/components/organisms/update-image-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "vst-ui";
import Link from "next/link";
import { Collection } from "vst-database";
import { api } from "@/utils/api";
import { useDebouncedValue } from "@mantine/hooks";
import { toast } from "vst-ui";

const CollectionMetaCard: React.FC<{
  collection: Collection;
  belongsToSessionUser: boolean;
}> = ({ ...props }) => {
  const [iconUpdateDialogOpen, setIconUpdateDialogOpen] = useState(false);

  const { mutate: updateCollection } = api.collection.update.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [collectionState, setCollectionState] = useState<Partial<Collection>>();

  const [debouncedCollectionState] = useDebouncedValue(collectionState, 600);

  useEffect(() => {
    if (!props.collection?.id) return;

    setCollectionState(props.collection);
  }, [props.collection]);

  useEffect(() => {
    if (!debouncedCollectionState?.id) return;
    if (!debouncedCollectionState?.name) return;
    if (!props.belongsToSessionUser) return;

    updateCollection({
      ...debouncedCollectionState,
      id: props.collection?.id || -1,
      description: debouncedCollectionState?.description ?? "",
    });
  }, [debouncedCollectionState]);

  return (
    <>
      <UpdateImageDialog
        open={iconUpdateDialogOpen}
        onOpenChange={(v) => setIconUpdateDialogOpen(v)}
        onSuccess={(iconUrl) => {
          setCollectionState({
            ...collectionState,
            iconUrl,
          });
        }}
      />
      <Card className="h-fit">
        <CardHeader className="flex flex-row gap-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar
                  onClick={() => {
                    setIconUpdateDialogOpen(true);
                  }}
                  // on enter key
                  onKeyDown={(e) => {
                    setIconUpdateDialogOpen(true);
                  }}
                  className="cursor-pointer transition-opacity duration-300 hover:opacity-80"
                >
                  <AvatarImage
                    src={collectionState?.iconUrl || ""}
                    width={100}
                    height={100}
                    className="object-cover"
                    alt={props.collection?.name + " icon" || ""}
                  />

                  <AvatarFallback>
                    {props.collection?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>Update icon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex flex-col gap-y-1">
            <CardTitle>
              <Input
                disabled={!props.belongsToSessionUser}
                className={cn(
                  "ml-0",
                  false
                    ? "ring-2 ring-primary/10"
                    : "border-none text-base disabled:cursor-default disabled:text-foreground disabled:opacity-100 xl:min-w-[400px]",
                )}
                value={collectionState?.name}
                onChange={(e) => {
                  setCollectionState({
                    ...collectionState,
                    name: e.currentTarget.value || "",
                  });
                }}
              />
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <Textarea
            disabled={!props.belongsToSessionUser}
            className="mt-5  disabled:cursor-default disabled:text-muted-foreground disabled:opacity-100"
            value={collectionState?.description || ""}
            onChange={(e) => {
              setCollectionState({
                ...collectionState,
                description: e.currentTarget.value,
              });
            }}
          />
        </CardContent>
        <Separator />
        <CardFooter className="flex items-center gap-x-5 pt-5">
          {props.belongsToSessionUser && (
            <>
              <div className="flex items-center gap-x-1">
                <Label>Private</Label>
                <Checkbox
                  disabled={!props.belongsToSessionUser}
                  checked={collectionState?.private}
                  onCheckedChange={(v) => {
                    setCollectionState({
                      ...collectionState,
                      private: !!v.valueOf(),
                    });
                  }}
                />
              </div>
            </>
          )}
          <div className="flex items-center gap-x-1">
            <Label>Has order</Label>
            <Checkbox
              disabled={!props.belongsToSessionUser}
              checked={collectionState?.hasOrder}
              onCheckedChange={(v) => {
                setCollectionState({
                  ...collectionState,
                  hasOrder: !!v.valueOf(),
                });
              }}
            />
          </div>

          <div className="grow" />
          <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
            <span>created by </span>
            <Link
              className="ml-2 text-sm text-foreground hover:text-primary hover:underline"
              href={"/users/" + props.collection?.userId}
            >
              {props.belongsToSessionUser ? "You" : props.collection?.userName}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default CollectionMetaCard;
