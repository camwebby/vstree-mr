import ComboBoxSelect from "@/components/organisms/combo-select";
import { creators } from "@/constants/creators";
import React from "react";
import { Checkbox } from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";

const FilterBar: React.FC<{
    showTabBar: boolean;
}> = () => {
  return (
    <>
      <div
        className={cn(
          "max-w-screen sticky top-0 z-10 flex items-center gap-5 overflow-x-auto border-l border-border bg-background/60 p-3 backdrop-blur-sm lg:border-b",
          !showTabBar ? "mb-5" : "mb-0",
        )}
      >
        <ComboBoxSelect
          values={selectedCreators}
          setValues={(values) => {
            setSelectedCreators(values);
          }}
          allOptions={creators.sort((a, b) => a.localeCompare(b))}
          optionLabel="creator"
        />

        <ComboBoxSelect
          values={selectedTags}
          setValues={(values) => {
            setSelectedTags(values);
          }}
          allOptions={tags.sort((a, b) => a.localeCompare(b))}
          optionLabel="tag"
        />

        <div className="flex items-center space-x-2 rounded border border-border p-2">
          <Checkbox
            disabled={types[0] && !types[1]}
            checked={types[0]}
            onCheckedChange={(v) => {
              setTypes([true, !types.every(Boolean)]);
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
            disabled={types[1] && !types[0]}
            checked={types[1]}
            onCheckedChange={(v) => {
              setTypes([!types.every(Boolean), true]);
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
