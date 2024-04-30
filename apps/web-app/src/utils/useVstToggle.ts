import { api } from "./api";
import { toast } from "vst-ui";
import { Vst } from "vst-database";
import { signIn } from "next-auth/react";

export const useVstToggle = ({ vst }: { vst: Vst }) => {
  const apiContext = api.useContext();

  const toggleMutation = api.userVst.toggleStat.useMutation({
    onSuccess: async () => {
      await apiContext.userVst.getByVstId.invalidate({ vstId: vst.id });

      await apiContext.vsts.getBySlug.invalidate({ slug: vst.slug });

      await apiContext.vsts.getAllPaginated.invalidate({});
    },
    onMutate: async (updatedData) => {
      await apiContext.userVst.getByVstId.cancel({ vstId: vst.id });

      const prevData = apiContext.userVst.getByVstId.getData({
        vstId: vst.id,
      });

      if (!prevData) {
        return { prevData: {} };
      }

      // validate is logged in
      if (!prevData?.userId) {
        await signIn();
        return;
      }

      const toggleOnOff = !prevData[updatedData.stat]

      apiContext.userVst.getByVstId.setData(
        {
          vstId: vst.id,
        },
        {
          ...prevData,
          [updatedData.stat]: toggleOnOff ? new Date() : undefined,
        },
      );

      return { prevData };
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: error.message,
      });
    },
  });

  return toggleMutation;
};
