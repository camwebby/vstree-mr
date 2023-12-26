import { Input } from "vst-ui";
import UserCommand from "./user-command";
import Link from "next/link";
import { useState } from "react";
import { cn } from "vst-ui/src/lib/utils";

import SiteSearch from "./site-search";

export function Header({ className }: { className?: string }) {
  const [showSiteSearch, setShowSiteSearch] = useState(false);

  return (
    <div
      className={cn(
        "z-10 flex items-center justify-start gap-x-3 border-b border-border bg-background p-5",
        className,
      )}
    >
      <Link
        className="
      rounded-full border-2 border-muted-foreground/10 p-2 px-3 text-xs
      font-semibold uppercase tracking-widest
      text-foreground duration-500 hover:bg-secondary
    "
        href={"/"}
      >
        VSTREE
      </Link>

      <div className="grow" />
      <Input
        onClick={() => setShowSiteSearch(true)}
        onChange={(e) => {
          setShowSiteSearch(true);

          // clear input
          e.target.value = "";
        }}
        name="search"
        placeholder="Search"
        className="hidden max-w-sm md:block"
      />
      <SiteSearch
        open={showSiteSearch}
        onOpenChange={(open) => setShowSiteSearch(open)}
      />

      <UserCommand />
    </div>
  );
}
