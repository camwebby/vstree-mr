import { CollectionComment, VstComment } from "vst-database";
import { UserComment } from "./user-comment";

export const UserCommentWithReplies = ({
  comment,
  replies,
  onClick,
  // TODO:  onDelete,
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
