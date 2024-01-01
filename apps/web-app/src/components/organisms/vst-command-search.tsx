import { api } from "@/utils/api";
import { Vst } from "@prisma/client";
import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "vst-ui";
import { Avatar, AvatarFallback, AvatarImage } from "vst-ui";

export const VstSearchCommandMenu = ({
  open,
  onVstClick,
  onOpenChange,
}: {
  open: boolean;
  onVstClick: (vst: Vst) => void;
  onOpenChange: (open: boolean) => void;
}) => {
  const [search, setSearch] = useState<string>("");

  const { data, isLoading } = api.vsts.getAll.useQuery(undefined, {
    enabled: open,
  });

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search for VSTs..."
        value={search}
        onInput={(event) => setSearch(event.currentTarget.value)}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Results">
          {isLoading && <CommandItem>Loading...</CommandItem>}
          {data?.map((vst) => (
            <CommandItem
              key={vst.id}
              onSelect={() => {
                onVstClick(vst);
              }}
            >
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src={""} />
                <AvatarFallback>{vst.name[0]}</AvatarFallback>
              </Avatar>
              {vst.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
