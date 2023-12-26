import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "vst-ui";
import { z } from "zod";
import { Button } from "vst-ui";
import { Input } from "vst-ui";
import { Textarea } from "vst-ui";
import { Switch } from "vst-ui";
import { Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { VstSearchCommandMenu } from "./../vst-command-search";
import { api } from "@/utils/api";
import { Collection } from "@prisma/client";
import { toast } from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";
import { Reorder } from "framer-motion";
import { NewCollectionContext } from "@/contexts/new-collection";
import {
  defaultFormValues,
  formSchema,
} from "@/contexts/new-collection/consts";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "vst-ui";
import { DropzoneUpload } from "vst-ui";
import { S3_FOLDER } from "@/pages/api/file-upload/consts";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { Sheet, SheetContent } from "vst-ui";
import TableItem from "./partials/tableItem";

export function NewCollection() {
  const router = useRouter();

  const apiContext = api.useContext();

  const {
    form,
    minimized,
    setMinimized,
    showNewCollectionForm,
    setShowNewCollectionForm,
    clearLocalStorage,
  } = useContext(NewCollectionContext);

  const { mutate: vstCollectionCreate, isLoading: isCreatingVstCol } =
    api.collectionVst.create.useMutation({});

  const { mutate: collectionCreate, isLoading: isCreatingCol } =
    api.collection.create.useMutation({
      onSuccess: async (collection: Collection) => {
        // Invalidate caches
        await apiContext.collection.getByUserId.invalidate({
          userId: collection.userId,
        });

        await apiContext.collection.getAll.invalidate();

        // Create the child collection vsts
        const idList = form.getValues("vsts")?.map((vst) => vst.tempId);

        form.getValues("vsts")?.forEach((vst) => {
          const order = idList?.indexOf(vst.tempId);

          vstCollectionCreate({
            collectionId: collection.id,
            vstId: vst.id,
            order,
            note: vst.note,
          });

          form.reset(defaultFormValues, { keepValues: false });
        });

        clearLocalStorage();

        await router
          .push(`/collections/${collection.slug}`)
          .catch(() =>
            toast({
              variant: "destructive",
              description:
                "There was an error redirecting you to the collection.",
            }),
          )
          .then(() => {
            setShowNewCollectionForm(false);
            setMinimized(true);
          });
      },
      onMutate: () => {},
      onError: (error) => {
        toast({
          variant: "destructive",
          description: error.message,
        });
      },
    });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // parse the form data
    const parsedData = formSchema.safeParse(data);

    // if there are errors, return
    if (!parsedData.success) {
      toast({
        description: parsedData.error.issues[0]?.message,
      });
      return;
    }

    collectionCreate({
      name: data.collectionName,
      private: data.private,
      description: data.description || null,
      iconUrl: data.iconUrl || "",
      hasOrder: false,
    });
  };

  const { status } = useSession();

  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [showWarnDialog, setShowWarnDialog] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" && showNewCollectionForm) {
      signIn().catch(() =>
        toast({
          variant: "destructive",
          description: "There was an error signing you in.",
        }),
      );
    }
  }, [status, showNewCollectionForm]);

  const isCreating = isCreatingCol || isCreatingVstCol;

  return (
    <>
      <Dialog
        open={showWarnDialog}
        onOpenChange={(open) => {
          setShowWarnDialog(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            This will reset all the changes you made to the form.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setShowWarnDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                form.reset(defaultFormValues, { keepValues: false });
                setShowNewCollectionForm(false);
                setShowWarnDialog(false);
              }}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showNewCollectionForm && (
        <>
          <Sheet
            open={!minimized}
            onOpenChange={(open) => {
              setMinimized(!open);
            }}
          >
            <SheetContent
              side="bottom"
              className="z-[50] max-h-[90vh] w-screen p-0"
            >
              <VstSearchCommandMenu
                onOpenChange={(open) => {
                  setSearchDialogOpen(open);
                }}
                onVstClick={(vst) => {
                  const guid = crypto.randomUUID();
                  form.setValue("vsts", [
                    ...form.getValues("vsts"),
                    {
                      id: vst.id,
                      name: vst.name,
                      note: "",
                      tempId: guid,
                    },
                  ]);

                  setSearchDialogOpen(false);
                }}
                open={searchDialogOpen}
              />

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={cn("m-0 p-0")}
                >
                  <div className="relative m-0 grid grid-cols-1 p-0 md:grid-cols-2">
                    <div className="container w-full max-w-[2xl] overflow-y-scroll border bg-card/80 pb-32 pt-12 md:h-screen">
                      <Reorder.Group
                        axis="y"
                        className="flex flex-col gap-2"
                        as="div"
                        values={form.watch("vsts")}
                        onReorder={(items) => {
                          form.setValue("vsts", items);
                        }}
                      >
                        {form.watch("vsts")?.map((vst, indexInTable) => (
                          <Reorder.Item
                            drag={"y"}
                            as="tr"
                            className="flex w-full flex-wrap gap-3 rounded-md border bg-muted-foreground/5 p-5 backdrop-blur-md"
                            key={vst.tempId}
                            value={vst}
                          >
                            <TableItem
                              vst={vst}
                              indexInTable={indexInTable}
                              onNoteChange={(note) => {
                                const vsts = form.getValues("vsts");

                                if (!vsts?.length) return;

                                const index = vsts?.findIndex(
                                  (v) => v.tempId === vst.tempId,
                                );

                                //@ts-expect-error - possible undefined
                                vsts[index].note = note;

                                form.setValue("vsts", vsts);
                              }}
                              onDelete={() => {
                                const vsts = form.getValues("vsts") ?? [];

                                const index = vsts?.findIndex(
                                  (v) => v.tempId === vst.tempId,
                                );

                                if (index === -1) return;

                                vsts.splice(index, 1);

                                form.setValue("vsts", vsts);
                              }}
                            />
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>

                      <Button
                        type="button"
                        variant={"secondary"}
                        onClick={() => {
                          setSearchDialogOpen(true);
                        }}
                        className="mt-5 w-full"
                      >
                        Add VST
                      </Button>
                    </div>

                    <div className="container sticky top-0 flex h-screen flex-col gap-y-4 bg-card/90 pt-10">
                      <FormField
                        name="collectionName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                className={cn(
                                  "resize-none",
                                  form.formState.errors.collectionName &&
                                    "border-red-500",
                                )}
                                placeholder={field.name}
                                {...field}
                                value={form.getValues("collectionName")}
                              />
                            </FormControl>
                            <FormDescription />
                            <FormMessage>
                              {form.formState.errors.collectionName?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                className={cn(
                                  "resize-none",
                                  form.formState.errors.description &&
                                    "border-red-500",
                                )}
                                placeholder={field.name}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="private"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormLabel>Private</FormLabel>
                            <FormControl>
                              <Switch {...field} />
                            </FormControl>
                            <FormDescription>
                              Only you will be able to see this collection
                            </FormDescription>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="hasOrder"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormLabel>Has order</FormLabel>
                            <FormControl>
                              <Switch {...field} />
                            </FormControl>
                            <FormDescription>
                              Should the VSTs in this collection be ordered?
                            </FormDescription>
                            <FormMessage>
                              {form.formState.errors.hasOrder?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      <DropzoneUpload
                        className="top-0 my-5 cursor-pointer rounded-md border border-dashed border-border bg-muted-foreground/10 bg-opacity-100 p-3 text-sm text-muted-foreground duration-200 ease-in-out hover:border-primary hover:bg-opacity-50"
                        onSuccess={(url) => {
                          form.setValue("iconUrl", url);
                        }}
                        onError={(error) => {
                          toast({
                            variant: "destructive",
                            description:
                              error?.message ||
                              "There was an error uploading your image. Please try again.",
                          });
                        }}
                        imagesOnly
                        folder={S3_FOLDER.COLLECTION_ICONS}
                        render={(fileSrc) =>
                          !!fileSrc || form.watch("iconUrl") ? (
                            <div className="flex flex-col items-center">
                              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                                <Image
                                  alt="Uploaded image"
                                  src={fileSrc || form.watch("iconUrl") || ""}
                                  fill
                                  className="rounded-full object-cover"
                                />
                              </div>
                              <p className="mt-2">Change image</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center ">
                              <p>Upload image</p>
                              <p className="text-xs text-muted-foreground/70">
                                (Optional)
                              </p>
                            </div>
                          )
                        }
                      />

                      {/* <Separator className="my-5" /> */}

                      <div className="flex items-center justify-between gap-x-2">
                        <Button
                          variant="destructive"
                          type="button"
                          className="w-full flex-grow"
                          onClick={() => {
                            setShowWarnDialog(true);
                          }}
                        >
                          Reset
                        </Button>

                        <Button
                          disabled={isCreating}
                          type="submit"
                          className="w-full flex-grow"
                        >
                          {isCreating ? (
                            <>
                              <Loader2 className="animate-spin" />
                            </>
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </>
      )}
    </>
  );
}
