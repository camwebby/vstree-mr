import { z } from "zod";

export const zUserCollectionCountStats = z.enum(["likesAt"]);
export const zCollectionCountStats = z.enum(["countLikes"]);
