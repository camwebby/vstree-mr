import { z } from "zod";

export const daws = [
  "Ableton Live",
  "FL Studio",
  "Logic Pro",
  "Pro Tools",
  "Studio One",
  "Cubase",
  "Reaper",
  "Bitwig",
  "GarageBand",
  "Audacity",
] as const;

// In GB
export const memoryOptions = [
  0.5, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 32, 64,
] as const;

export const cpuArchitectures = ["x86", "x64", "arm", "arm64"] as const;

export const experienceRateOptions = [
  "Does not work",
  "Works with major issues",
  "Works with minor issues",
  "Works seamlessly",
] as const;

export const operatingSystems = [
  "Windows",
  "Mac",
  "Linux",
  "iOS",
  "Android",
  "Chrome",
] as const;

export const supportedOsVersions: Partial<
  Record<(typeof operatingSystems)[number], string[]>
> = {
  Windows: ["11", "10", "8.1", "8", "7"],
  Mac: ["Senoma", "Monterey", "Big Sur", "Catalina", "Mojave", "High Sierra"],
  Linux: ["Ubuntu 20.04", "Ubuntu 18.04", "Fedora 34", "Debian 10"],
  iOS: ["17", "16", "15", "14", "13", "12", "11", "10", "9", "< 9"],
  Android: ["12", "11", "10", "9", "8", "7", "6", "5"],
  Chrome: ["Windows", "Mac", "Linux"],
};

export const supportedDawVersions: Partial<
  Record<(typeof daws)[number], string[]>
> = {
  "Ableton Live": ["11", "10", "9", "8", "7", "6", "5"],
  "FL Studio": ["20", "12", "11", "10", "9", "8", "7", "6", "5"],
  "Logic Pro": ["X", "9", "8"],
  "Pro Tools": ["2021", "2020", "2019", "2018", "12"],
  "Studio One": ["5", "4", "3"],
  Cubase: ["11", "10.5", "10", "9.5", "9"],
  Reaper: ["6", "5", "4"],
  Bitwig: ["4", "3", "2"],
  GarageBand: ["10", "9", "8"],
  Audacity: ["3", "2"],
};

export const rateExpSchema = z.object({
  daw: z.enum(daws),
  dawVersion: z.string().nonempty().optional(),

  systemOS: z.enum(operatingSystems).optional(),
  osVersion: z.string().optional(),

  cpuArchitecture: z.enum(cpuArchitectures).optional(),
  systemMemory: z.number().optional(),

  experienceRating: z.enum(experienceRateOptions),
  vstId: z.number(),
});
