import { defaultFormValues } from "@/contexts/new-collection/consts";
import { api } from "@/utils/api";
import { Collection } from "vst-database";
import { toast } from "vst-ui";

export const useCollectionCreate = ({
  apiContext,
  form,
  setShowNewCollectionForm,
  setMinimized,
  vstCollectionCreate,
  clearLocalStorage,
  router,
}) =>
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
