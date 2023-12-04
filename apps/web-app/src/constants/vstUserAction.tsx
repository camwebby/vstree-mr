import { HeartIcon, LibraryIcon, ShoppingBag } from "lucide-react";

export const vstUserAction = {
  Like: "likesAt",
  Want: "wantsAt",
  Own: "ownsAt",
} as const;

export const vstToggleToCount = {
  likesAt: "countLikes",
  ownsAt: "countOwns",
  wantsAt: "countWants",
  commentsAt: "countComments",
} as const;

export const vstStatIconMap: Record<
  keyof typeof vstUserAction,
  {
    checked: React.ReactNode;
    unchecked: React.ReactNode;
  }
> = {
  Like: {
    checked: <HeartIcon className="fill-primary text-primary" />,
    unchecked: <HeartIcon className="fill-muted-foreground/50 text-muted-foreground/40" />,
  },
  Want: {
    checked: <ShoppingBag className="text-primary" />,
    unchecked: <ShoppingBag className="text-muted-foreground/40" />,
  },
  Own: {
    checked: <LibraryIcon className="text-primary" />,
    unchecked: <LibraryIcon className="text-muted-foreground/40" />,
  },
};
