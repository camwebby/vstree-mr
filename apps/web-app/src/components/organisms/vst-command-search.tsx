import { api } from "@/utils/api";
import { Vst } from "@prisma/client";
import { useMemo, useState } from "react";
import {
  Badge,
  Dialog,
  DialogContent,
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
  const [enabledQuery, setEnableQuery] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 200);

  const { data, isLoading } = api.vsts.getAll.useQuery(undefined, {
    enabled: enabledQuery,
  });

  const filteredResults = useMemo(() => {
    if (debouncedSearch === "") {
      return data || [];
    }

    return search(debouncedSearch, data || [], {
      keySelector: (obj) => obj.name,
    });
  }, [data, debouncedSearch]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        setEnableQuery(true);
      }}
    >
      <DialogContent className="max-h-[55vh] overflow-y-scroll p-0">
        {isLoading ? (
          <>
            <Loader2 className="m-4 animate-spin" />
          </>
        ) : (
          <>
            <Input
              className="sticky top-0 z-20 border-none p-5"
              placeholder="Search for VSTs..."
              value={searchTerm}
              onInput={(event) => setSearchTerm(event.currentTarget.value)}
            />

            <Table>
              <TableBody>
                {filteredResults?.length === 0 && (
                  <TableRow className="flex cursor-pointer items-center justify-between">
                    <TableCell className="flex items-center gap-x-2">
                      <span className="text-muted-foreground">
                        No results found.
                      </span>
                    </TableCell>
                  </TableRow>
                )}
                {filteredResults?.map((vst) => (
                  <TableRow
                    key={vst.id}
                    onClick={() => {
                      onVstClick(vst);
                    }}
                    className="flex flex-nowrap cursor-pointer items-center justify-between"
                  >
                    <TableCell className="flex items-center gap-x-2">
                      <Avatar className="mr-2 h-6 w-6">
                        <AvatarImage src={""} />
                        <AvatarFallback>{vst.name[0]}</AvatarFallback>
                      </Avatar>
                      {vst.name}
                    </TableCell>
                    <TableCell className="space-x-1 flex-nowrap whitespace-nowrap">
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
              </TableBody>
            </Table>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
