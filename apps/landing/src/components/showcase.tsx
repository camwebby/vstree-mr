import Image from "next/image";
import React from "react";

const FadeLine = ({ className }: { className: string }) => (
  <svg
    className={className + " pointer-events-none"}
    width="1317"
    height="295"
    viewBox="0 0 1317 295"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="1317" height="295" fill="url(#paint0_radial_5_246)" />
    <defs>
      <radialGradient
        id="paint0_radial_5_246"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(658.5 44.5) rotate(90) scale(250.5 625.598)"
      >
        <stop stop-color="#171B25" />
        <stop offset="1" stop-color="#030712" stop-opacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

const Showcase = () => {
  return (
    <section className="relative bg-background min-h-screen text-primary isolate py-12 lg:py-24 overflow-x-hidden max-w-screen">
      {/* <FadeLine className="absolute top-0 left-0 z-0" /> */}
      <div className="container">
        <div className="text-center flex flex-col items-center z-[999] gap-y-5 py-20 px-5 lg:px-0">
          <h1 className="text-3xl lg:text-5xl font-semibold max-w-xs lg:max-w-lg">
            Rate, collate vsts,{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #8FBCFE 0%, #9BC9FF 100%)",
              }}
              className="bg-clip-text text-transparent"
            >
              plugins
            </span>{" "}
            and more
          </h1>
          <p className="supplement-copy">
            LooksRare is the web3 NFT Marketplace where traders and collectors
            have earned over $1.3 Billion in rewards.
          </p>
        </div>

        <div className="bg-secondary/30 overflow-hidden aspect-[12/10] lg:aspect-[25/10] pt-32 px-10 lg:pt-20 lg:px-20 rounded-xl  border border-border">
          <div className="relative bg-primary/5 w-full aspect-[28/20] ">
            <Image alt="VST dashboard" src="/screenshots/vsts.png" fill />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
