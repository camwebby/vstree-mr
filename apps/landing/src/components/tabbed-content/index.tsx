import Image from "next/image";
import React from "react";
import TabbedContentTabs from "./client";

const TabbedContent = () => {
  return (
    <section
      style={{
        mixBlendMode: "luminosity",
      }}
      className="relative bg-cover bg-center
      border-y border-slate-300 bg-foreground
      bg-no-repeat py-16 lg:py-32"
    >
      <Image
        fill
        alt=""
        style={{
          mixBlendMode: "luminosity",
        }}
        className="object-cover z-0 pointer-events-none"
        src="/stylo-bg.png"
      />

      <div className="container z-30">
        <p className="text-primary font-semibold text-center">Features</p>
        <h3 className="text-3xl text-center lg:text-5xl font-bold text-background mb-4 lg:mb-6">
          Vst quick saves
        </h3>

        <TabbedContentTabs />
      </div>
    </section>
  );
};

export default TabbedContent;
