import { NewCollectionContext } from "@/contexts/new-collection";
import {
  defaultFormValues,
  formSchema,
} from "@/contexts/new-collection/consts";
import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  DropzoneUpload,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Sheet,
  SheetContent,
  Switch,
  Textarea,
  toast,
} from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";
import { BLOB_FOLDERS } from "vst-utils";
import { z } from "zod";
import VstSearchDialog from "../vst-search-dialog";
import { useCollectionCreate } from "./hooks";
import NewColCancelDialog from "./partials/cancel-dialog";
import VstDndList from "./partials/vst-dnd-list";

const NewCollection = () => {
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
    useCollectionCreate({
      apiContext,
      form,
      setShowNewCollectionForm,
      setMinimized,
      vstCollectionCreate,
      clearLocalStorage,
      router,
    });

  const onSubmit = useCallback(async (data: z.infer<typeof formSchema>) => {
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
  }, []);

  const { status } = useSession();

  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [showWarnDialog, setShowWarnDialog] = useState(false);

  // Redirect to sign in if the user is not authenticated
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

  const [mobileView, setMobileView] = useState(0);

  return (
    <>
      <NewColCancelDialog
        {...{
          showWarnDialog,
          setShowWarnDialog,
          setShowNewCollectionForm,
          form,
          defaultFormValues,
        }}
      />

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
              className="z-[50] h-[87vh] w-screen  p-0"
            >
              <VstSearchDialog
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

              <Button
                className="my-2 ml-8 block md:hidden"
                variant={"secondary"}
                onClick={() => {
                  setMobileView(mobileView === 0 ? 1 : 0);
                }}
              >
                {
                  {
                    0: "Next",
                    1: "Back to collection vsts",
                  }[mobileView]
                }
              </Button>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={cn("m-0 p-0")}
                >
                  <div className="relative m-0 grid grid-cols-1 p-0 md:grid-cols-2">
                    <div
                      className={`container h-[87vh] w-full max-w-[2xl] overflow-y-scroll border-t bg-card/80 pb-24 pt-12 md:max-h-none md:pb-36
                    ${mobileView === 0 ? "block" : "hidden md:block"}
                    `}
                    >
                      <Button
                        type="button"
                        onClick={() => {
                          setSearchDialogOpen(true);
                        }}
                        className="mb-5 w-full"
                      >
                        Add VST
                      </Button>
                      <VstDndList form={form} />
                    </div>

                    <div
                      className={`container flex h-fit flex-col gap-y-4 overflow-y-auto border-t bg-card py-10 md:sticky md:h-screen md:bg-card/90 lg:top-0
                    ${mobileView === 1 ? "block" : "hidden md:block"}
                    `}
                    >
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
                                placeholder={"Best free reverb plugins"}
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
                                placeholder={""}
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
                        folder={BLOB_FOLDERS.COLLECTION_ICONS}
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
};

export default memo(NewCollection);
