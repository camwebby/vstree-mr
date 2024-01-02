import { api } from "@/utils/api";
import { Vst } from "@prisma/client";
import { useMemo, useState } from "react";
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "vst-ui";
import { Avatar, AvatarFallback, AvatarImage } from "vst-ui";
import { search } from "fast-fuzzy";
import { Loader2 } from "lucide-react";
import { useDebouncedValue } from "@mantine/hooks";

export const VstSearchCommandMenu = ({
  open,
  onVstClick,
  onOpenChange,
}: {
  open: boolean;
  onVstClick: (vst: Vst) => void;
  onOpenChange: (open: boolean) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 200);

  const { data, isLoading, isInitialLoading } = api.vsts.getAll.useQuery(
    undefined,
    {
      enabled: debouncedSearch !== "",
    },
  );

  const filteredResults = useMemo(() => {
    if (debouncedSearch === "") {
      return data || [];
    }

    return search(debouncedSearch, data || [], {
      keySelector: (obj) => obj.name,
    });
  }, [data, debouncedSearch]);

  const maxLength = 12;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[55vh] overflow-y-scroll p-0">
        <DialogHeader className="sticky top-0 z-20 border-b bg-background/70 p-6 backdrop-blur-md">
          <DialogTitle className="mb-2">Search</DialogTitle>
          <Input
            className=""
            placeholder="Search for VSTs..."
            value={searchTerm}
            onInput={(event) => setSearchTerm(event.currentTarget.value)}
          />
        </DialogHeader>
        {isInitialLoading ? (
          <>
            <Loader2 className="mx-6 mb-6 animate-spin" />
          </>
        ) : (
          <>
            <Table>
              <TableBody>
                {filteredResults?.length === 0 &&
                  searchTerm !== "" &&
                  !isInitialLoading && (
                    <TableRow className="flex cursor-pointer items-center justify-between">
                      <TableCell className="flex items-center gap-x-2">
                        <span className="text-muted-foreground">
                          No results found.
                        </span>
                      </TableCell>
                    </TableRow>
                  )}
                {filteredResults?.slice(0, maxLength).map((vst) => (
                  <TableRow
                    key={vst.id}
                    onClick={() => {
                      onVstClick(vst);
                    }}
                    className="flex cursor-pointer flex-nowrap items-center justify-between"
                  >
                    <TableCell className="flex items-center gap-x-2">
                      <Avatar className="mr-2 h-6 w-6">
                        <AvatarImage src={""} />
                        <AvatarFallback>{vst.name[0]}</AvatarFallback>
                      </Avatar>
                      {vst.name}
                    </TableCell>
                    <TableCell className="flex-nowrap space-x-1 whitespace-nowrap">
                      {vst.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant={"secondary"}>
                          {t}
                        </Badge>
                      ))}
                      {vst.tags.length > 2 && (
                        <Badge variant={"secondary"}>
                          {vst.tags.length > 2 ? `+${vst.tags.length - 2}` : ""}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredResults?.length > maxLength && (
                  <TableRow className="flex items-center justify-between">
                    <TableCell className="flex items-center gap-x-2">
                      <span className="text-muted-foreground">
                        {filteredResults?.length - maxLength} more...
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
