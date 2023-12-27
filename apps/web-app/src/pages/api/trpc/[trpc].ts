import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { Handlers } from "@highlight-run/node";
import { env } from "@/env.mjs";
import { H } from "@highlight-run/node";

H.init({
  projectID: "lgxjrz4d",
  serviceName: "web-app-trpc",
  environment: env.VERCEL_ENV ?? "development",
  serviceVersion: env.VERCEL_GIT_COMMIT_SHA ?? "unknown",
});

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ error, req }) => {
    Handlers.trpcOnError(
      { error, req },
      {
        projectID: "lgxjrz4d",
        serviceName: "web-app-trpc",
        serviceVersion: env.VERCEL_GIT_COMMIT_SHA ?? "unknown",
        environment: env.VERCEL_ENV ?? "development",
      },
    );
  },
});
