import { appConfig } from "@/constants/app-config";
import { useRouter } from "next/router";
import { useState } from "react";
import { Vst } from "vst-database";
import { Input } from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";
import UserCommand from "../organisms/user-command";
import VstSearchDialog from "../organisms/vst-search-dialog";

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
      {appConfig.logo}
      <div className="grow" />
      <Input
        onClick={() => setShowSiteSearch(true)}
        onChange={(e) => {
          setShowSiteSearch(true);
          e.target.value = "";
        }}
        name="search"
        placeholder="Search"
        className="hidden bg-card text-card-foreground max-w-sm md:block"
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
