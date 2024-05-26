import { collectionSortOptions } from "@/constants/collection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";

const CollectionActionBar = ({ ...props }) => {
  return (
    <div
      className={cn(
        `max-w-screen sticky top-0 z-10 mb-5 flex items-center gap-5 overflow-x-auto border-l border-border bg-card p-3 text-card-foreground
        backdrop-blur-sm lg:border-b
        `,
      )}
    >
      <Select
        onValueChange={(v: (typeof collectionSortOptions)[number]["value"]) => {
          props.setOrderBy(v);
        }}
      >
        <SelectTrigger className="max-w-xs">
          <SelectValue
            placeholder={
              collectionSortOptions.find((o) => o.value === props.orderBy)
                ?.label
            }
          />
        </SelectTrigger>
        <SelectContent>
          {collectionSortOptions.map((option) => (
            <>
              <SelectItem value={option.value} key={option.value}>
                {option.label}
              </SelectItem>
            </>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CollectionActionBar;
