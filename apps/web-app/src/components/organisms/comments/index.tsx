import { api } from "@/utils/api";
import { signIn, useSession } from "next-auth/react";
import { memo } from "react";
import { CollectionComment, VstComment } from "vst-database";
import { toast } from "vst-ui";
import { CommentsCard } from "./partials/comment-card";

const CollectionCommentsComponent = ({
  collectionId,
}: {
  collectionId?: number;
}) => {
  const apiContext = api.useContext();

  const { data } = api.collection.getCommentsByCollectionId.useQuery(
    {
      collectionId: collectionId || -1,
    },
    {
      enabled: !!collectionId,
    },
  );

  const { mutate, isError } = api.collection.createComment.useMutation({
    onSuccess: async () => {
      await apiContext.collection.getCommentsByCollectionId.invalidate({
        collectionId,
      });
    },

    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteComment } = api.collection.deleteComment.useMutation({
    onSuccess: async () => {
      await apiContext.collection.getCommentsByCollectionId.invalidate({
        collectionId,
      });
    },

    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const { status } = useSession();

  if (!collectionId) {
    return null;
  }

  return (
    <CommentsCard
      onDelete={(commentId: number) => {
        deleteComment({
          id: commentId,
        });
      }}
      onNewComment={(comment: string, repliesToId?: number) => {
        if (status !== "authenticated") {
          signIn().catch((e) => {
            toast({
              title: "Error",
              description: "Something went wrong",
              variant: "destructive",
            });
          });

          return false;
        }

        mutate({
          collectionId,
          comment,
          repliesToId,
        });

        return !isError;
      }}
      comments={data as CollectionComment[]}
    ></CommentsCard>
  );
};

const VstCommentsComponent = ({ vstId }: { vstId?: number }) => {
  const apiContext = api.useContext();

  const { data } = api.vsts.getCommentsByVstId.useQuery(
    {
      id: vstId || -1,
    },
    {
      enabled: !!vstId,
    },
  );

  const { mutate, isError } = api.vsts.createComment.useMutation({
    onSuccess: async () => {
      await apiContext.vsts.getCommentsByVstId.invalidate({
        id: vstId,
      });
    },

    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteComment } = api.vsts.deleteComment.useMutation({
    onSuccess: async () => {
      await apiContext.vsts.getCommentsByVstId.invalidate({
        id: vstId,
      });
    },

    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const { status } = useSession();

  if (!vstId) {
    return null;
  }

  return (
    <CommentsCard
      onDelete={(commentId: number) => {
        deleteComment({
          id: commentId,
        });
      }}
      onNewComment={(comment: string, repliesToId?: number) => {
        if (status !== "authenticated") {
          signIn().catch((e) =>
            toast({
              title: "Error",
              description: "Something went wrong",
              variant: "destructive",
            }),
          );

          return false;
        }

        mutate({
          vstId,
          comment,
          repliesToId,
        });

        return !isError;
      }}
      comments={data as VstComment[]}
    ></CommentsCard>
  );
};

export const CollectionComments = memo(CollectionCommentsComponent);
export const VstComments = memo(VstCommentsComponent);
