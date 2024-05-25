import { VstUiIconProps } from "./types";

export const InstrumentIcon: React.FC<VstUiIconProps> = ({ ...props }) => (
  <svg
    width="37"
    height="37"
    viewBox="0 0 35 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M33.625 10.0811L17.625 1L1.625 10.0811M33.625 10.0811L17.625 19.1622M33.625 10.0811V25.6486L17.625 34.7297M1.625 10.0811L17.625 19.1622M1.625 10.0811V25.6486L17.625 34.7297M17.625 19.1622V34.7297"
      className="stroke-foreground"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
