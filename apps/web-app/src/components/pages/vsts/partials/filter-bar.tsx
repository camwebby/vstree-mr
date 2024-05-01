import ComboBoxSelect from "@/components/organisms/combo-select";
import { creators } from "@/constants/creators";
import { tags } from "@/constants/tags";
import React from "react";
import { Checkbox } from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";

const FilterBar: React.FC<{
    showTabBar: boolean;
    selectedCreators: string[];
    setSelectedCreators: (values: string[]) => void;
    selectedTags: string[];
    setSelectedTags: (values: string[]) => void;
    types: boolean[];
    setTypes: (values: boolean[]) => void;
}> = ({...props}) => {
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

        <div className="flex items-center space-x-2 rounded border border-border p-2">
          <Checkbox
            disabled={props.types[0] && !props.types[1]}
            checked={props.types[0]}
            onCheckedChange={(v) => {
              props.setTypes([true, !props.types.every(Boolean)]);
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
            disabled={props.types[1] && !props.types[0]}
            checked={props.types[1]}
            onCheckedChange={(v) => {
              props.setTypes([!props.types.every(Boolean), true]);
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

export default FilterBar;
