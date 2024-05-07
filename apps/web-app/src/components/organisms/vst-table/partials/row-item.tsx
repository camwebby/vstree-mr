import { Link } from "lucide-react";
import React, { memo } from "react";
import {
  TableRow,
  TableCell,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Badge,
} from "vst-ui";
import VSTAvatar from "../../vst-avatar";
import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/molecules/skeleton-card";

const VSTHoverCard = dynamic(() => import("../../vst-hover-card"), {
  ssr: false,
  loading: () => <SkeletonCard />,
});

const VSTTableRowItem = ({ vst }) => {
  return (
    <TableRow className="cursor-pointer items-center">
      <TableCell>
        <Link href={`/vsts/${vst.slug}`}>
          <VSTHoverCard vstSlug={vst.slug}>
            <VSTAvatar item={vst} />
            {vst?.name}
          </VSTHoverCard>
        </Link>
      </TableCell>
      <TableCell className="flex flex-row flex-wrap items-center gap-2  ">
        {vst?.tags?.slice(0, 3).map((tag) => (
          <Badge key={tag + "_badge_" + vst?.id} variant={"secondary"}>
            {tag}
          </Badge>
        ))}
        {vst?.tags?.length > 3 && (
          <HoverCard>
            <HoverCardTrigger>
              <Badge className="opacity-80" variant={"secondary"}>
                +{vst?.tags?.length - 3}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent>
              {
                <div className="flex flex-row flex-wrap items-center gap-2  ">
                  {vst?.tags?.map((tag) => (
                    <Badge
                      key={tag + "_badge_" + vst?.id}
                      variant={"secondary"}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              }
            </HoverCardContent>
          </HoverCard>
        )}
      </TableCell>
    </TableRow>
  );
};

export default memo(VSTTableRowItem);
