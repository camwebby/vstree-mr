import { formSchema, newCollectionVstItem } from "./consts";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type TNewCollectionContext = {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  showNewCollectionForm: boolean;
  setShowNewCollectionForm: React.Dispatch<React.SetStateAction<boolean>>;
  minimized: boolean;
  setMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  clearLocalStorage: () => void;
};

export type TNewCollectionVstItem = z.infer<typeof newCollectionVstItem>;
