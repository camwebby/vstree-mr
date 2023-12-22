import { z } from "zod";

export const newCollectionVstItem = z.object({
  tempId: z.string().uuid(),
  name: z.string(),
  iconUrl: z.string().optional(),
  id: z.number(),
  note: z.string().optional(),
  isInstrument: z.boolean().optional(),
});

export const vstItem = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().optional(),
  slug: z.string(),
});

export const collectionVstItem = z.object({
  id: z.number(),
  collectionId: z.number(),
  note: z.string().optional(),
  order: z.number().optional(),
  vst: vstItem,
});

export const formSchema = z.object({
  collectionName: z
    .string()
    .min(
      3,
      "Collection name is required and must be at least 3 characters long",
    )
    .max(50),
  iconUrl: z.string().optional(),
  description: z.string().max(400).optional(),
  private: z.boolean(),
  hasOrder: z.boolean(),
  vsts: z
    .array(newCollectionVstItem)
    .min(1, "At least one VST is required")
    .max(25, "No more than 25 VSTs are allowed"),
});

export const defaultFormValues = {
  collectionName: "",
  description: "",
  private: false,
  hasOrder: false,
  iconSrc: "",
  vsts: [],
};
