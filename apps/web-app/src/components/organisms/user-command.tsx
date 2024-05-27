import { NewCollectionContext } from "@/contexts/new-collection";
import { LogInIcon, LogOutIcon, PencilIcon, PlusIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  Dialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from "vst-ui";
import { CollectionIcon } from "vst-ui/src/assets";
import { cn } from "vst-ui/src/lib/utils";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

export default function UserCommand({ className }: PopoverTriggerProps) {
  const [open, setOpen] = React.useState(false);

  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);

  const { data: userData } = useSession();

  const { setTheme } = useTheme();

  const { showNewCollectionForm, setShowNewCollectionForm, setMinimized } =
    React.useContext(NewCollectionContext);

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn(
              "w-fit justify-between bg-card text-card-foreground",
              className,
            )}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={userData?.user?.image || ""}
                alt={userData?.user?.name || ""}
              />
              <AvatarFallback>
                {userData?.user?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Label>{userData?.user.name}</Label>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            {!!userData && (
              <CommandList>
                <CommandGroup heading="Your account">
                  <Link href={`/users/${userData?.user?.id}`}>
                    <CommandItem className="cursor-pointer">
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={userData?.user?.image || ""}
                          alt={userData?.user?.name || ""}
                        />
                        <AvatarFallback>
                          {userData?.user?.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      My profile
                    </CommandItem>
                  </Link>
                </CommandGroup>
              </CommandList>
            )}

            <CommandGroup heading="Dashboards">
              <Link href={`/`}>
                <CommandItem className="cursor-pointer">VSTs</CommandItem>
              </Link>
              <Link href={`/collections`}>
                <CommandItem className="cursor-pointer">
                  <CollectionIcon className="size-4" />
                  <span>Collections</span>
                </CommandItem>
              </Link>
            </CommandGroup>

            <CommandGroup heading="Actions">
              <CommandItem
                onSelect={() => {
                  if (showNewCollectionForm) {
                    setMinimized(false);
                  }

                  setShowNewCollectionForm(true);
                  setMinimized(false);
                }}
                className="flex cursor-pointer items-center"
              >
                {!showNewCollectionForm ? (
                  <PlusIcon className="mr-2 h-4 w-4 opacity-50" />
                ) : (
                  <PencilIcon className="mr-2 h-4 w-4 opacity-50" />
                )}

                <span>
                  {showNewCollectionForm ? "Edit" : "Create"} collection
                </span>
              </CommandItem>

              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <CommandItem className="flex cursor-pointer items-center gap-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-4 text-muted-foreground"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25ZM3.5 8v7.75c0 .414.336.75.75.75h11.5a.75.75 0 0 0 .75-.75V8h-13ZM5 4.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V5a.75.75 0 0 0-.75-.75H5ZM7.25 5A.75.75 0 0 1 8 4.25h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V5ZM11 4.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V5a.75.75 0 0 0-.75-.75H11Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Change theme</span>
                  </CommandItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setTheme("default");
                      location.reload();
                    }}
                  >
                    Live (dark)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setTheme("twitter");
                      location.reload();
                    }}
                  >
                    Tweeter (light)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setTheme("teriyaki");
                      location.reload();
                    }}
                  >
                    Teriyaki (light)
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem
                    onClick={() => {
                      setTheme("system");
                      location.reload();
                    }}
                  >
                    System
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </CommandGroup>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                {!!userData?.user && (
                  <CommandItem
                    onSelect={async () => {
                      await signOut().catch((e) => {
                        toast({
                          title: "Error",
                          description:
                            "Could not sign out. THERE IS NO ESCAPE.",
                          variant: "destructive",
                        });
                      });
                    }}
                    className="gap-x-1"
                  >
                    <LogOutIcon className={cn("h-4 w-4 opacity-50")} />
                    Sign out
                  </CommandItem>
                )}

                {!userData?.user && (
                  <CommandItem onSelect={() => signIn()}>
                    <LogInIcon className="mr-2 h-4 w-4 opacity-50" />
                    Sign in
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  );
}
