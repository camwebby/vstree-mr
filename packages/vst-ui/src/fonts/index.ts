import localFont from "next/font/local";

export const givonic = localFont({
  src: [
    {
      path: "./Givonic-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Givonic-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Givonic-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});