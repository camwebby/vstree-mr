import ComboBoxSelect from "@/components/molecules/combo-select";
import { creators } from "@/constants/creators";
import { tags } from "@/constants/tags";
import React, { Dispatch, SetStateAction, memo } from "react";
import { Checkbox } from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";

const FilterBar: React.FC<{
  showTabBar: boolean;
  selectedCreators: string[];
  setSelectedCreators: Dispatch<SetStateAction<string[]>>;
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
  selectedVstTypes: [boolean, boolean];
  setSelectedVstTypes: Dispatch<SetStateAction<[boolean, boolean]>>;
}> = ({ ...props }) => {
  return (
    <>
      <div
        className={cn(
          "max-w-screen sticky top-0 z-10 flex items-center gap-5 overflow-x-auto border-l border-border bg-background/60 p-3 backdrop-blur-sm lg:border-b",
          !props.showTabBar ? "mb-5" : "mb-0",
        )}
      >
        <ComboBoxSelect
          values={props.selectedCreators}
          setValues={(values) => {
            props.setSelectedCreators(values);
          }}
          allOptions={creators.sort((a, b) => a.localeCompare(b))}
          optionLabel="creator"
        />

        <ComboBoxSelect
          values={props.selectedTags}
          setValues={(values) => {
            props.setSelectedTags(values);
          }}
          allOptions={tags.sort((a, b) => a.localeCompare(b))}
          optionLabel="tag"
        />

        <div className="flex items-center gap-x-2 rounded border border-border bg-card p-2 text-card-foreground">
          <Checkbox
            disabled={props.selectedVstTypes[0] && !props.selectedVstTypes[1]}
            checked={props.selectedVstTypes[0]}
            onCheckedChange={() => {
              props.setSelectedVstTypes([
                true,
                !props.selectedVstTypes.every(Boolean),
              ]);
            }}
            id="effects"
          />
          <label
            htmlFor="effects"
            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Effects
          </label>
          <Checkbox
            disabled={props.selectedVstTypes[1] && !props.selectedVstTypes[0]}
            checked={props.selectedVstTypes[1]}
            onCheckedChange={() => {
              props.setSelectedVstTypes([
                !props.selectedVstTypes.every(Boolean),
                true,
              ]);
            }}
            id="instruments"
          />
          <label
            htmlFor="instruments"
            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Instruments
          </label>
        </div>
      </div>
    </>
  );
};

export default memo(FilterBar);
