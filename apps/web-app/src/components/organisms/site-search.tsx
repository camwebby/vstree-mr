import { ComponentProps, useState } from "react";
import { api } from "@/utils/api";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "vst-ui";
import Link from "next/link";
import VSTAvatar from "./vst-avatar";

const SiteSearch = (props: ComponentProps<typeof CommandDialog>) => {
  const [showMoreState, _] = useState<
    "effects" | "instruments" | "collections"
  >("effects");

  const { data: vsts, isLoading: vstsLoading } = api.vsts.getAll.useQuery(
    undefined,
    {
      enabled: !!props.open,
    },
  );

  return (
    <CommandDialog {...props}>
      <CommandInput placeholder="Search..." />

      {!vsts?.length || vstsLoading ? (
        <></>
      ) : (
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Effects">
            {vsts
              .slice(0, showMoreState === "effects" ? undefined : 4)
              .map((vst) => (
                <Link key={vst.id} href={`/vsts/${vst.slug}`}>
                  <CommandItem
                    className="flex cursor-pointer items-center gap-x-3"
                    key={vst.id}
                    title={vst.name}
                  >
                    <VSTAvatar item={vst} />
                    <span>{vst.name}</span>
                  </CommandItem>
                </Link>
              ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      )}
    </CommandDialog>
  );
};

export default SiteSearch;
