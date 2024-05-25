import { z } from "zod";

export const zUserVstCountStats = z.enum(["likesAt", "wantsAt", "ownsAt"]);
export const zVstCountStats = z.enum(["countLikes", "countWants", "countOwns"]);
