import React, { useMemo } from "react";
import { CollectionComment, VstComment } from "vst-database";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "vst-ui";
import { UserCommentWithReplies } from "./comment-w-replies";
import { CommentsModal } from "./comment-modal";

export const CommentsCard = ({
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
              <UserCommentWithReplies
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
