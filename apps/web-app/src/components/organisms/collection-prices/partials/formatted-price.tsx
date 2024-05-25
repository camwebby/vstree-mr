import { OpenInNewWindowIcon } from "vst-ui";
import { WhereToFind } from "vst-database";
import Link from "next/link";
import { currencyFormatter } from "@/utils/currentFormatter";

export const FormattedPrice = ({
  wtfs,
  vstId,
}: {
  wtfs: (WhereToFind | null)[];
  vstId: number;
}) => {
  const wtf = wtfs?.find((wtf) => wtf?.vstId === vstId);

  if (!wtf) {
    return <>-</>;
  }

  return (
    <div
      className={`flex flex-row items-center gap-x-2 ${
        !!wtf ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      <span>
        {!!wtf
          ? currencyFormatter(wtf.currency).format((wtf?.price || 0) / 100)
          : "N/A"}
      </span>
      <Link rel="noopener noreferrer" target="_blank" href={wtf.url}>
        <OpenInNewWindowIcon />
      </Link>
    </div>
  );
};
