import React from "react";

const TwoColContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-4 overflow-x-hidden p-3 lg:flex-row lg:gap-6 lg:p-6">
    {children}
  </div>
);

const TwoColFirst = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-grow flex-col gap-4 md:min-w-[400px] lg:gap-6">
    {children}
  </div>
);

const TwoColSecond = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-full max-w-none flex-col gap-3 lg:max-w-md lg:gap-6 xl:min-w-[400px] 2xl:max-w-lg">
    {children}
  </div>
);

export { TwoColContainer, TwoColFirst, TwoColSecond };
