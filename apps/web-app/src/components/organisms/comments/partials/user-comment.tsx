
import { VstComment, CollectionComment } from "vst-database";
import { Avatar, AvatarImage, AvatarFallback } from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";
import UserHoverCard from "../../user-hover-card";
import Link from "next/link";

export const UserComment = ({
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
