import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  experienceRateOptions,
  rateExpSchema,
} from "@/components/organisms/compatibility-rate/consts";

export const userCanSubmitVstExp = (userId: number, vstId: number) => {};

export const userVstExperienceRouter = createTRPCRouter({
  submit: publicProcedure
    .input(rateExpSchema)
    .mutation(async ({ ctx, input }) => {
      // user must be logged in
      if (!ctx?.session?.user?.id) {
        throw new Error("You must be logged in to submit");
      }

      // Validate user can submit
      // must not have submitted a exp for vst in last 5 days
      const lastExp = await ctx.db.userVstExperience.findFirst({
        where: {
          userId: ctx.session.user.id,
          vstId: input.vstId,
          daw: input.daw,
          osVersion: input.osVersion,
          createdAt: {
            gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 5),
          },
        },
      });

      if (!!lastExp) {
        throw new Error("You cannot submit another experience at this time.");
      }

      return await ctx.db.userVstExperience.create({
        data: {
          ...input,
          experienceRating: experienceRateOptions.indexOf(
            input.experienceRating,
          ),
          userId: ctx.session.user.id,
        },
      });
    }),

  retrieveByVstId: publicProcedure
    .input(
      z.object({
        vstId: z.number().min(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.userVstExperience.findMany({
        where: {
          deletedAt: null,
          vstId: input.vstId,
        },
      });
    }),

  retrieveByConfiguration: publicProcedure
    .input(
      z.object({
        vstId: z.number().min(0),
        systemOS: z.string(),
        osVersion: z.string(),
        cpuArchitecture: z.string(),
        systemMemory: z.number(),
        daw: z.string(),
        dawVersion: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.userVstExperience.findMany({
        where: {
          deletedAt: null,
          vstId: input.vstId,
          systemOS: input.systemOS,
          // osVersion: input.osVersion,
          // cpuArchitecture: input.cpuArchitecture,
          // systemMemory: {
          //   lte: input.systemMemory,
          // },
          daw: input.daw,
          dawVersion: input.dawVersion,
        },
      });
    }),
});
