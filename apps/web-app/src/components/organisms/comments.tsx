import { api } from "@/utils/api";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { memo, useMemo } from "react";
import { CollectionComment, VstComment } from "vst-database";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Textarea,
  toast,
} from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";
import UserHoverCard from "./user-hover-card";

const UserComment = ({
  comment,
  onClick,
  isReply = false,
}: {
  comment: VstComment | CollectionComment;
  onClick: () => void;
  isReply?: boolean;
}) => {
  return (
    <div className={`my-2 flex min-h-[60px] gap-x-2 ${isReply ? "pl-10" : ""}`}>
      <div className="w-1/12 pt-1">
        <UserHoverCard userId={comment.userId}>
          <Link className="" href={`/users/${comment.userId}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={comment.userIconUrl || ""}
                alt={comment.userName || ""}
                className="object-cover"
              />
              <AvatarFallback>
                {comment.userName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </UserHoverCard>
        <div className="my-1" />
        <div className="text-xs text-muted-foreground"></div>
      </div>
      <div
        onClick={onClick}
        className={cn(
          "w-11/12 cursor-pointer rounded-md border border-transparent bg-muted duration-200 hover:border-gray-500",
          {
            "border-border": true,
          },
        )}
      >
        <div className="rounded-sm p-3 text-sm">
          <div className="flex">
            <div className="w-10/12">
              <div className=" font-semibold">{comment.userName}</div>
              <div className="text-sm text-muted-foreground">
                {comment.text}
              </div>
            </div>
            <div className="w-2/12">
              <div className="flex justify-end">
                {!isReply && <div className="ml-2 text-xs ">Reply</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Comment = ({
  comment,
  replies,
  onClick,
  onDelete,
  truncateReplies,
}: {
  comment: VstComment | CollectionComment;
  replies: (VstComment | CollectionComment)[];
  onClick: () => void;
  onDelete: () => void;
  truncateReplies?: boolean;
}) => {
  return (
    <>
      <UserComment comment={comment} onClick={onClick} />

      {truncateReplies && (
        <div className="text-xs text-muted-foreground">
          {replies?.length} repl{replies?.length === 1 ? "y" : "ies"}
        </div>
      )}

      {!truncateReplies &&
        replies?.map((reply) => (
          <UserComment
            key={reply.id}
            comment={reply}
            onClick={onClick}
            isReply={true}
          />
        ))}
    </>
  );
};

type FormattedComment = (VstComment | CollectionComment) & {
  replies: (VstComment | CollectionComment)[];
};

const CommentsModal = ({
  open,
  onOpenChange,
  formattedComments,
  onNewComment,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formattedComments: FormattedComment[];
  onNewComment: (newComment: string, repliesTo?: number) => boolean;
  onDelete: (commentId: number) => void;
}) => {
  const [newComment, setNewComment] = React.useState("");
  const [repliesToCommentId, setRepliesToCommentId] = React.useState<
    number | undefined
  >(undefined);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] w-screen overflow-y-auto"
      >
        <div className="mx-auto max-w-4xl pb-16 pt-8">
          <SheetHeader className="dark:bg-dark-primary-800 z-10 bg-background">
            <SheetTitle>All comments</SheetTitle>
          </SheetHeader>
          {formattedComments?.map((comment) => {
            return (
              <Comment
                key={comment.id}
                comment={comment}
                replies={comment.replies}
                onClick={() => setRepliesToCommentId(comment.id)}
                onDelete={() => onDelete(comment.id)}
              />
            );
          })}
          <SheetFooter className="sticky bottom-0 mt-7 flex flex-col">
            {repliesToCommentId && (
              <Button
                className=""
                variant="outline"
                onClick={() => {
                  setRepliesToCommentId(undefined);
                }}
              >
                You&#39;re replying to{" "}
                {formattedComments?.find(
                  (comment) => comment.id === repliesToCommentId,
                )?.userName ?? "comment"}
              </Button>
            )}
            <form
              className="flex w-full flex-col gap-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (onNewComment(newComment, repliesToCommentId)) {
                  setNewComment("");
                  setRepliesToCommentId(undefined);
                }
              }}
            >
              <Textarea
                onChange={(e) => setNewComment(e.target.value)}
                value={newComment}
                className="w-full"
                placeholder="Write a comment"
              />
              <Button disabled={!newComment} type="submit">
                Submit
              </Button>
            </form>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const CommentsCard = ({
  comments,
  onNewComment,
  onDelete,
}: {
  comments: (VstComment | CollectionComment)[];
  onNewComment: (newComment: string, repliesTo?: number) => boolean;
  onDelete: (commentId: number) => void;
}) => {
  const [showCommentsModal, setShowCommentsModal] = React.useState(false);

  const formattedComments = useMemo(() => {
    return comments
      ?.filter((comment) => !comment.repliesToCommentId)
      ?.map((comment) => {
        return {
          ...comment,
          replies:
            comments?.filter(
              (reply) => reply.repliesToCommentId === comment.id,
            ) || [],
        };
      });
  }, [comments]);

  return (
    <>
      <CommentsModal
        open={showCommentsModal}
        onOpenChange={setShowCommentsModal}
        onNewComment={onNewComment}
        formattedComments={formattedComments}
        onDelete={onDelete}
      />

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>

        <CardContent>
          {!comments?.length && (
            <div className="text-sm text-muted-foreground">No comments yet</div>
          )}

          {formattedComments?.slice(0, 3).map((comment) => {
            return (
              <Comment
                key={comment.id}
                comment={comment}
                replies={comment?.replies ?? []}
                onClick={() => setShowCommentsModal(true)}
                onDelete={() => {}} // TODO
                truncateReplies
              />
            );
          })}
        </CardContent>
        <CardFooter>
          <Button
            variant="secondary"
            onClick={() => setShowCommentsModal(true)}
          >
            View all comments
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

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
