import { api } from "@/utils/api";
import { Code2Icon, Loader2 } from "lucide-react";
import { ComponentProps, memo, useMemo, useState } from "react";
import { Button, Dialog, DialogContent, DialogTrigger } from "vst-ui";
import { experienceRateOptions } from "../compatibility-rate/consts";
import { heatmapAxisOpts } from "./consts";
import HeatmapFeatureSelect from "./partials/heatmap-feature-select";
import HeatmapGrid from "./partials/heatmap-grid";
import { heatmapLabelMap, transformDataForHeatmap } from "./utils";

const CompatibilityHeatmap: React.FC<
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

  // Axis state
  const [xAxis, setXAxis] = useState<
    (typeof heatmapAxisOpts)[number] | undefined
  >(heatmapAxisOpts[0]);
  const [yAxis, setYAxis] = useState<
    (typeof heatmapAxisOpts)[number] | undefined
  >(heatmapAxisOpts[1]);

  // Labels & data
  const xLabels = useMemo(() => {
    return !!xAxis ? heatmapLabelMap[xAxis] : [];
  }, [xAxis]);

  const yLabels = useMemo(() => {
    return !!yAxis ? heatmapLabelMap[yAxis] : [];
  }, [yAxis]);

  const transformedData: number[][] = useMemo(() => {
    return transformDataForHeatmap({
      data,
      xLabels: xLabels as string[],
      yLabels: yLabels as string[],
      xAxis: xAxis as string,
      yAxis: yAxis as string,
    });
  }, [data, xAxis, yAxis, xLabels, yLabels]);

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
        <HeatmapFeatureSelect
          xAxis={xAxis}
          yAxis={yAxis}
          setXAxis={setXAxis}
          setYAxis={setYAxis}
        />

        <div className=" w-full">
          {isLoading || !(!!xLabels && !!yLabels) ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <HeatmapGrid
              {...{
                transformedData,
                xLabels: xLabels as string[],
                yLabels: yLabels as string[],
              }}
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

export default memo(CompatibilityHeatmap);
