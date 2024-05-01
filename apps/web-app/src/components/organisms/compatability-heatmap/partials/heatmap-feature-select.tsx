import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "vst-ui";
import { heatmapAxisOpts } from "../consts";

/**
 * Responsible for managing the selection of the heatmap's x and y axis.
 */
const HeatmapFeatureSelect: React.FC<{
  xAxis: (typeof heatmapAxisOpts)[number];
  yAxis: (typeof heatmapAxisOpts)[number];
  setYAxis: React.Dispatch<
    React.SetStateAction<(typeof heatmapAxisOpts)[number]>
  >;
  setXAxis: React.Dispatch<
    React.SetStateAction<(typeof heatmapAxisOpts)[number]>
  >;
}> = ({ ...props }) => {
  return (
    <div className="flex flex-row gap-5">
      <Select
        onValueChange={(v: (typeof heatmapAxisOpts)[number]) => {
          props.setYAxis(v);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Y Axis" />
        </SelectTrigger>
        <SelectContent>
          {heatmapAxisOpts.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(v: (typeof heatmapAxisOpts)[number]) => {
          props.setXAxis(v);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="X Axis" />
        </SelectTrigger>
        <SelectContent>
          {heatmapAxisOpts
            .filter((opt) => opt !== props.yAxis)
            .map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HeatmapFeatureSelect;
