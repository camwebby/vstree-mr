import { Check, ChevronsUpDown } from "lucide-react";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "vst-ui";
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
          className="w-[200px] justify-between whitespace-nowrap bg-card text-sm font-normal text-card-foreground"
        >
          {!!values?.length
            ? `${values.length} ${optionLabel}${
                values.length > 1 ? "s" : ""
              } selected...`
            : `Select ${optionLabel}s...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

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
