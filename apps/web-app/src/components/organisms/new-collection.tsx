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
import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "vst-ui";
import { Trash, Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { VstSearchCommandMenu } from "./vst-command-search";
import { api } from "@/utils/api";
import { Collection } from "@prisma/client";
import { toast } from "vst-ui";
import { cn } from "@/lib/utils";
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
import VSTAvatar from "./vst-avatar";

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

  // On escape click
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMinimized(true);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

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
                    <div className="container w-full max-w-[2xl] overflow-y-auto bg-card/80 py-10 md:h-screen">
                      <Table className="">
                        <TableHeader className="">
                          <TableRow>
                            <TableHead className="">Vst</TableHead>
                            <TableHead className="flex-grow">Note</TableHead>
                            <TableHead className="text-right"></TableHead>
                            <TableHead className="text-right"></TableHead>
                          </TableRow>
                        </TableHeader>
                        {/* <TableBody> */}
                        <Reorder.Group
                          axis="y"
                          as="tbody"
                          values={form.watch("vsts")}
                          onReorder={(items) => {
                            form.setValue("vsts", items);
                          }}
                        >
                          {form.watch("vsts")?.map((vst, indexInTable) => (
                            <Reorder.Item
                              drag={"y"}
                              as="tr"
                              key={vst.tempId}
                              value={vst}
                            >
                              <TableCell className="flex items-center gap-x-2 font-medium">
                                <VSTAvatar
                                  className="h-8 w-8"
                                  item={{
                                    name: vst.name,
                                    iconUrl: vst.iconUrl || null,
                                  }}
                                />
                                {vst.name}
                              </TableCell>
                              <TableCell className="text-right">
                                <Input
                                  className={cn("format zod form errors")}
                                  placeholder="Note"
                                  defaultValue={vst.note}
                                  onInput={(e) => {
                                    const vsts = form.getValues("vsts");

                                    if (!vsts?.length) return;

                                    const index = vsts?.findIndex(
                                      (v) => v.tempId === vst.tempId,
                                    );

                                    //@ts-expect-error - possible undefined
                                    vsts[index].note = e.currentTarget.value;

                                    form.setValue("vsts", vsts);
                                  }}
                                ></Input>
                              </TableCell>

                              <TableCell>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const vsts = form.getValues("vsts") ?? [];

                                    const index = vsts?.findIndex(
                                      (v) => v.tempId === vst.tempId,
                                    );

                                    if (index === -1) return;

                                    vsts.splice(index, 1);

                                    form.setValue("vsts", vsts);
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </TableCell>
                              <TableCell className="cursor-move">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 39 39"
                                  width="16"
                                  height="16"
                                >
                                  <path
                                    d="M 5 0 C 7.761 0 10 2.239 10 5 C 10 7.761 7.761 10 5 10 C 2.239 10 0 7.761 0 5 C 0 2.239 2.239 0 5 0 Z"
                                    fill="#CCC"
                                  ></path>
                                  <path
                                    d="M 19 0 C 21.761 0 24 2.239 24 5 C 24 7.761 21.761 10 19 10 C 16.239 10 14 7.761 14 5 C 14 2.239 16.239 0 19 0 Z"
                                    fill="#CCC"
                                  ></path>
                                  <path
                                    d="M 33 0 C 35.761 0 38 2.239 38 5 C 38 7.761 35.761 10 33 10 C 30.239 10 28 7.761 28 5 C 28 2.239 30.239 0 33 0 Z"
                                    fill="#CCC"
                                  ></path>
                                  <path
                                    d="M 33 14 C 35.761 14 38 16.239 38 19 C 38 21.761 35.761 24 33 24 C 30.239 24 28 21.761 28 19 C 28 16.239 30.239 14 33 14 Z"
                                    fill="#CCC"
                                  ></path>
                                  <path
                                    d="M 19 14 C 21.761 14 24 16.239 24 19 C 24 21.761 21.761 24 19 24 C 16.239 24 14 21.761 14 19 C 14 16.239 16.239 14 19 14 Z"
                                    fill="#CCC"
                                  ></path>
                                  <path
                                    d="M 5 14 C 7.761 14 10 16.239 10 19 C 10 21.761 7.761 24 5 24 C 2.239 24 0 21.761 0 19 C 0 16.239 2.239 14 5 14 Z"
                                    fill="#CCC"
                                  ></path>
                                  <path
                                    d="M 5 28 C 7.761 28 10 30.239 10 33 C 10 35.761 7.761 38 5 38 C 2.239 38 0 35.761 0 33 C 0 30.239 2.239 28 5 28 Z"
                                    fill="#CCC"
                                  ></path>
                                  <path
                                    d="M 19 28 C 21.761 28 24 30.239 24 33 C 24 35.761 21.761 38 19 38 C 16.239 38 14 35.761 14 33 C 14 30.239 16.239 28 19 28 Z"
                                    fill="#CCC"
                                  ></path>
                                  <path
                                    d="M 33 28 C 35.761 28 38 30.239 38 33 C 38 35.761 35.761 38 33 38 C 30.239 38 28 35.761 28 33 C 28 30.239 30.239 28 33 28 Z"
                                    fill="#CCC"
                                  ></path>
                                </svg>
                              </TableCell>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                        {form.formState.errors.vsts?.message && (
                          <TableCaption className="text-red-500">
                            {form.formState.errors.vsts?.message}
                          </TableCaption>
                        )}
                      </Table>

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
