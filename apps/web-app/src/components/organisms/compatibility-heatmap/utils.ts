import { UserVstExperience } from "vst-database";
import {
  cpuArchitectures,
  daws,
  memoryOptions,
  operatingSystems,
} from "../compatibility-rate/consts";

export const formatHeatmapRating = (rating: number): string => {
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

export const heatmapLabelMap = {
  daw: daws,
  systemOS: operatingSystems,
  cpuArchitecture: cpuArchitectures,
  systemMemory: memoryOptions,
  // dawVersion: supportedDawVersions[selectedDAW] || [],
  // osVersion: selectedOS ? operatingSystems[selectedOS].versions : [],
};

export const transformDataForHeatmap = ({
  data,
  xLabels,
  yLabels,
  xAxis,
  yAxis,
}: {
  data: UserVstExperience[] | undefined;
  xLabels: string[];
  yLabels: string[];
  xAxis: string;
  yAxis: string;
}): number[][] => {
  if (!data || !yLabels?.length || !xLabels.length) return [[]];

  let transformedData = new Array(yLabels.length)
    .fill(0)
    .map(() => new Array(xLabels.length).fill(-1) as number[]);

  if (!transformedData) return transformedData;

  data.forEach((exp) => {
    const x = !!xAxis ? xLabels.indexOf(exp[xAxis]) : -1;
    const y = !!yAxis ? yLabels.indexOf(exp[yAxis]) : -1;

    if (x === -1 || y === -1) return;

    if (!!transformedData[y]) {
      //@ts-ignore
      transformedData[y][x] = exp.experienceRating;
    }
  });

  return transformedData;
};
