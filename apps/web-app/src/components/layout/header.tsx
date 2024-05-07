import { Input } from "vst-ui";
import UserCommand from "../organisms/user-command";
import Link from "next/link";
import { useState } from "react";
import { cn } from "vst-ui/src/lib/utils";
import { VstSearchDialog } from "../organisms/vst-search-dialog";
import { useRouter } from "next/router";
import { Vst } from "vst-database";

export function Header({ className }: { className?: string }) {
  const [showSiteSearch, setShowSiteSearch] = useState(false);

  const router = useRouter();
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
      <VstSearchDialog
        open={showSiteSearch}
        onOpenChange={(open) => setShowSiteSearch(open)}
        onVstClick={(vst: Vst) => {
          router.push(`/vsts/${vst.slug}`);
          setShowSiteSearch(false);
        }}
      />

      <UserCommand />
    </div>
  );
}
