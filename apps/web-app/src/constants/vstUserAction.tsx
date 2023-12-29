import { FolderCheck, HeartIcon, LibraryIcon, ShoppingBag } from "lucide-react";

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

const Folder: React.FC<{ className?: string }> = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M3.75 3A1.75 1.75 0 0 0 2 4.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-8.5A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM10 8a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 10 8Z"
      clipRule="evenodd"
    />
  </svg>
);

const Shopping: React.FC<{ className?: string }> = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fill-rule="evenodd"
      d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.5A1.75 1.75 0 0 0 3.84 19H16.16a1.75 1.75 0 0 0 1.743-1.902l-.826-9.5A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5ZM7.5 10a2.5 2.5 0 0 0 5 0V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-8 0V8.75a.75.75 0 0 1 1.5 0V10Z"
      clip-rule="evenodd"
    />
  </svg>
);

export const vstStatIconMap: Record<
  | keyof typeof vstUserAction
  | (typeof vstUserAction)[keyof typeof vstUserAction],
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
  likesAt: {
    checked: <HeartIcon className="fill-primary text-primary" />,
    unchecked: (
      <HeartIcon className="fill-muted-foreground/50 text-muted-foreground/40" />
    ),
  },
  Want: {
    checked: <Shopping className="h-6 w-6 text-primary" />,
    unchecked: <Shopping className="h-6 w-6 text-muted-foreground/40" />,
  },
  wantsAt: {
    checked: <Shopping className="h-6 w-6 text-primary" />,
    unchecked: <Shopping className="h-6 w-6 text-muted-foreground/40" />,
  },
  Own: {
    checked: <Folder className="h-6 w-6 text-primary" />,
    unchecked: <Folder className="h-6 w-6 text-muted-foreground/40" />,
  },
  ownsAt: {
    checked: <Folder className="h-6 w-6 text-primary" />,
    unchecked: <Folder className="h-6 w-6 text-muted-foreground/40" />,
  },
};
