import { NewCollectionContext } from "@/contexts/new-collection";
import { LogInIcon, LogOutIcon, PencilIcon, PlusIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import * as React from "react";
import {
  Avatar, AvatarFallback, AvatarImage, Button, Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator, Dialog, DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger, Label, Popover, PopoverContent, PopoverTrigger, toast
} from "vst-ui";
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
            className={cn("w-fit justify-between", className)}
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
                    <CommandItem>
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
                <CommandItem>VSTs</CommandItem>
              </Link>
              <Link href={`/collections`}>
                <CommandItem>Collections</CommandItem>
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
                <DropdownMenuTrigger>
                  <CommandItem className="flex cursor-pointer items-center">
                    <span>Change theme</span>
                  </CommandItem>
                  {/* <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left text-xs"
                >
                  <p>Change theme</p>
                </Button> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
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
