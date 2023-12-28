import { HeatMapGrid } from "react-grid-heatmap";
import {
  cpuArchitectures,
  daws,
  experienceRateOptions,
  memoryOptions,
  operatingSystems,
} from "./compatibility-rate/consts";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "vst-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "vst-ui";
import { api } from "@/utils/api";
import { Button } from "vst-ui";
import { Code2Icon, Loader2 } from "lucide-react";

const axisOpts = [
  "daw",
  "systemOS",
  "cpuArchitecture",
  "systemMemory",
  // "dawVersion",
  // "osVersion",
] as const;

const labelMap = ({
  selectedOS,
  selectedDAW,
}: {
  selectedOS?: keyof typeof operatingSystems;
  selectedDAW?: keyof typeof daws;
}) => ({
  daw: daws,
  systemOS: operatingSystems,
  cpuArchitecture: cpuArchitectures,
  systemMemory: memoryOptions,
  // dawVersion: supportedDawVersions[selectedDAW] || [],
  // osVersion: selectedOS ? operatingSystems[selectedOS].versions : [],
});

export const formatRating = (rating: number): string => {
  if (rating > 2.5) {
    return "Great!";
  }

  if (rating >= 2) {
    return "Minor issues.";
  }

  if (rating >= 1) {
    return "Major issues";
  }

  return "No dice";
};

const CompatabilityHeatmap: React.FC<
  ComponentProps<typeof Dialog> & {
    vstId: number;
  }
> = ({ ...props }) => {
  const [triggerFetch, setTriggerFetch] = useState(false);

  const { data, isLoading } = api.userVstExperience.retrieveByVstId.useQuery(
    {
      vstId: props.vstId,
    },
    {
      enabled: triggerFetch,
    },
  );

  const [xAxis, setXAxis] = useState<(typeof axisOpts)[number] | undefined>(
    axisOpts[0],
  );
  const [yAxis, setYAxis] = useState<(typeof axisOpts)[number] | undefined>(
    axisOpts[1],
  );

  const xLabels = useMemo(() => {
    return !!xAxis ? labelMap({})[xAxis] : [];
  }, [xAxis]);
  const yLabels = useMemo(() => {
    return !!yAxis ? labelMap({})[yAxis] : [];
  }, [yAxis]);

  const transformedData: number[][] = useMemo(() => {
    if (!data || !yLabels?.length || !xLabels.length) return [[]];

    let transformedData = new Array(yLabels.length)
      .fill(0)
      .map(() => new Array(xLabels.length).fill(-1) as number[]);

    if (!transformedData) return transformedData;

    data.forEach((exp) => {
      //@ts-ignore
      const x = !!xAxis ? xLabels.indexOf(exp[xAxis]) : -1;
      //@ts-ignore
      const y = !!yAxis ? yLabels.indexOf(exp[yAxis]) : -1;

      if (x === -1 || y === -1) return;

      if (!!transformedData[y]) {
        //@ts-ignore
        transformedData[y][x] = exp.experienceRating;
      }
    });

    return transformedData;
  }, [data, xAxis, yAxis, xLabels, yLabels]);

  if (!xLabels || !yLabels) return null;

  return (
    <Dialog {...props}>
      <DialogTrigger
        onClick={() => {
          setTriggerFetch(true);
        }}
        asChild
      >
        <Button
          size={"sm"}
          variant={"secondary"}
          className="flex items-center gap-x-3"
        >
          <Code2Icon />
          <span>Check compatibility</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-row gap-5">
          <Select
            onValueChange={(v: (typeof axisOpts)[number]) => {
              setYAxis(v);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Y AXIS" />
            </SelectTrigger>
            <SelectContent>
              {axisOpts.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(v: (typeof axisOpts)[number]) => {
              setXAxis(v);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="X AXIS" />
            </SelectTrigger>
            <SelectContent>
              {axisOpts
                .filter((opt) => opt !== yAxis)
                .map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className=" w-full">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <HeatMapGrid
              data={transformedData}
              xLabels={xLabels as string[]}
              yLabels={yLabels as string[]}
              xLabelsStyle={(index) => ({
                fontSize: "11px",
              })}
              yLabelsStyle={(index) => ({
                fontSize: "11px",
              })}
              cellHeight="2rem"
              xLabelsPos="bottom"
              yLabelsPos="right"
              cellRender={(x, y, value) => (
                <div
                  title={
                    value === -1
                      ? "No data"
                      : "Experience rating: " + value + "/3"
                  }
                >
                  {value === -1 ? "❓" : value}
                </div>
              )}
              cellStyle={(_x, _y, ratio) => ({
                background: `hsl(var(--primary))`,
                opacity: !!ratio ? ratio : 0,
                fontSize: "11px",
                borderRadius: "0px",
                border: "none",
                margin: "1px",
              })}
            />
          )}
        </div>
        <div className="mt-3 w-full border-t border-border bg-secondary">
          {experienceRateOptions.map((opt, index) => (
            <div
              key={opt}
              className="flex flex-row items-center justify-between px-3 py-1"
            >
              <p className="text-xs text-muted-foreground">{opt}</p>
              <div className="flex flex-row items-center gap-x-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    background: `hsl(var(--primary))`,
                    opacity: (index + 1) / 3,
                  }}
                />
                <p className="text-xs text-muted-foreground">{index}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompatabilityHeatmap;
