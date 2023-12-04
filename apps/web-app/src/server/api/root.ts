import { createTRPCRouter } from "@/server/api/trpc";
import { vstRouter } from "./routers/vst";
import { collectionRouter } from "./routers/collection";
import { collectionVstRouter } from "./routers/vstCollection";
import { userVstRouter } from "./routers/userVst";
import { userCollectionRouter } from "./routers/userCollection";
import { whereToFindRouter } from "./routers/whereToFind";
import { userRouter } from "./routers/user";
import { userVstExperienceRouter } from "./routers/userVstExperience";

export const appRouter = createTRPCRouter({
  vsts: vstRouter,
  collection: collectionRouter,
  collectionVst: collectionVstRouter,
  userVst: userVstRouter,
  userCollection: userCollectionRouter,
  whereToFind: whereToFindRouter,
  user: userRouter,
  userVstExperience: userVstExperienceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
