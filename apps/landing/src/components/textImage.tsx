import { APP_URL } from "@/consts/envs";
import Link from "next/link";
import React from "react";

const TextImage = () => {
  return (
    <section className=" w-screen bg-background text-primary overflow-hidden overflow-x-hidden max-w-screen">
      <div className="container px-5 grid grid-cols-1 lg:grid-cols-2 place-items-center min-h-screen relative gap-7">
        {/* <Fade className="top-0 right-0 absolute" /> */}
        <div className="flex flex-col gap-y-5 order-2">
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
          <p className="text-sm lg:text-lg text-muted-foreground max-w-lg">
            LooksRare is the web3 NFT Marketplace where traders and collectors
            have earned over $1.3 Billion in rewards.
          </p>

          <Link
            href={APP_URL}
            className="bg-primary/10 rounded-full w-fit px-8 py-3 text-sm text-foreground border border-primary/20"
          >
            Get started
          </Link>
        </div>
        <div className="w-full h-full flex items-center justify-center order-1">
          <div className="bg-primary/10 w-full aspect-[15/10] rounded-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default TextImage;
