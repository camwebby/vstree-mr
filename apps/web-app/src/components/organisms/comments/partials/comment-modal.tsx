import { useState } from "react";
import {
    Button,
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    Textarea,
} from "vst-ui";
import { FormattedComment } from "../types";
import { UserCommentWithReplies } from "./comment-w-replies";

export const CommentsModal = ({
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
  const [newComment, setNewComment] = useState("");
  const [repliesToCommentId, setRepliesToCommentId] = useState<
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
              <UserCommentWithReplies
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
