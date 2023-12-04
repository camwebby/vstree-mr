import { HeartIcon } from "lucide-react";

export const collectionUserAction = {
  Like: "likesAt",
} as const;

export const collectionToggleToCount = {
  likesAt: "countLikes",
} as const;

export const collectionStatIconMap: Record<
  keyof typeof collectionUserAction,
  {
    checked: React.ReactNode;
    unchecked: React.ReactNode;
  }
> = {
  Like: {
    checked: <HeartIcon className="fill-primary text-primary" />,
    unchecked: (
      <HeartIcon className="fill-muted-foreground/50 text-muted-foreground/40" />
    ),
  },
};
