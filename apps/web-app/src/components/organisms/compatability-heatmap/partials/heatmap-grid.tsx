import React from "react";
import { HeatMapGrid } from "react-grid-heatmap";

const HeatmapGrid: React.FC<{
  transformedData: number[][];
  xLabels: string[];
  yLabels: string[];
}> = ({ ...props }) => {
  return (
    <HeatMapGrid
      data={props.transformedData}
      xLabels={props.xLabels as string[]}
      yLabels={props.yLabels as string[]}
      xLabelsStyle={() => ({
        fontSize: "11px",
      })}
      yLabelsStyle={() => ({
        fontSize: "11px",
      })}
      cellHeight="2rem"
      xLabelsPos="bottom"
      yLabelsPos="right"
      cellRender={(x, y, value) => (
        <div
          title={
            value === -1 ? "No data" : "Experience rating: " + value + "/3"
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
  );
};

export default HeatmapGrid;
