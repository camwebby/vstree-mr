import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "vst-ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "vst-ui";
import { Popover, PopoverContent, PopoverTrigger } from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";

export default function ComboBoxSelect({
  values,
  setValues,
  allOptions,
  optionLabel,
}: {
  values: string[];
  setValues: (values: string[]) => void;
  allOptions: string[];
  /**
   * Should be non plural
   */
  optionLabel: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild className="flex items-center">
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          className="w-[200px] justify-between whitespace-nowrap text-sm"
        >
          {!!values?.length
            ? `${values.length} ${optionLabel}${
                values.length > 1 ? "s" : ""
              } selected...`
            : `Select ${optionLabel}s...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* <Button
        className={cn(values.length === 0 ? "hidden" : "block", "shrink-0")}
        onClick={() => setValues([])}
        aria-label="Clear filter"
        variant={"ghost"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
      </Button> */}

      <PopoverContent className="max-h-[600px] w-[200px] overflow-y-auto p-0 text-sm">
        <Command>
          <CommandInput placeholder={`Search ${optionLabel}...`} />
          <CommandEmpty>No tag found.</CommandEmpty>
          <CommandGroup>
            {allOptions.map((option) => (
              <CommandItem
                key={option}
                onSelect={() => {
                  if (values.includes(option)) {
                    setValues(values.filter((value) => value !== option));
                  } else {
                    setValues([...values, option]);
                  }
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    values.includes(option) ? "opacity-100" : "opacity-0",
                  )}
                />
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
