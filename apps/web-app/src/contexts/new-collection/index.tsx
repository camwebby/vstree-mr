import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage } from "@mantine/hooks";
import { createContext, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { defaultFormValues, formSchema } from "./consts";
import type { TNewCollectionContext } from "./types";

export const NewCollectionContext = createContext<TNewCollectionContext>(
  {} as TNewCollectionContext,
);

const NewCollectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedFormValues, setSavedFormValues] = useLocalStorage({
    key: "new-collection-form",
    deserialize: (value) => JSON.parse(value) as typeof defaultFormValues,
    serialize: (value) => JSON.stringify(value),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: !!savedFormValues ? savedFormValues : defaultFormValues,
    resolver: zodResolver(formSchema),
  });

  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);

  const [minimized, setMinimized] = useState(true);

  // Listen for local storage changes, but not when form values change
  useEffect(() => {
    if (!savedFormValues?.collectionName) return;

    // If the saved form values are the same as the current form values, don't update the form
    if (JSON.stringify(savedFormValues) === JSON.stringify(form.getValues())) {
      return;
    }

    // If the saved form values are different from the current form values, update the form
    form.reset(savedFormValues);
  }, [savedFormValues]);

  // Listen for form changes and save them to local storage
  useEffect(() => {
    if (
      Object.values(form.getValues()).every(
        (value: NonNullable<unknown>[] | NonNullable<unknown>) =>
          (Array.isArray(value) && !value?.length) || !value,
      )
    )
      return;

    setSavedFormValues(form.getValues() as typeof defaultFormValues);
  }, [
    form.watch("collectionName"),
    form.watch("description"),
    form.watch("iconUrl"),
    form.watch("hasOrder"),
    form.watch("private"),
    form.watch("vsts"),
    // form.getValues(),
  ]);

  const clearLocalStorage = useCallback(() => {
    setSavedFormValues(defaultFormValues);
  }, [setSavedFormValues]);

  return (
    <NewCollectionContext.Provider
      value={{
        form,
        showNewCollectionForm,
        setShowNewCollectionForm,
        minimized,
        setMinimized,
        clearLocalStorage,
      }}
    >
      {children}
    </NewCollectionContext.Provider>
  );
};

export default NewCollectionProvider;
