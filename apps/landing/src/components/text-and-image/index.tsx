import Image from "next/image";
import React from "react";

const TextAndImage: React.FC<{
  title: string;
  icon?: React.ReactNode;
  description: string;
  imageSource: string;
  reverse?: boolean;
}> = ({ ...props }) => {
  return (
    <section className="bg-foreground py-16 lg:py-32">
      <div className=" container gap-5 grid grid-cols-1 lg:grid-cols-2 place-items-center lg:gap-20">
        <div
          className={
            "grid grid-cols-8 gap-x-12 " +
            (props.reverse ? "lg:order-last" : "")
          }
        >
          <div className="hidden lg:block">{props.icon}</div>
          <div className="col-span-8 lg:col-span-7">
            <h2 className="text-3xl max-w-[250px] lg:max-w-sm lg:text-5xl font-bold text-background/90 mb-4 lg:mb-6">
              {props.title}
            </h2>
            <p className="text-base lg:text-xl max-w-md text-muted-foreground mb-6">
              {props.description}
            </p>
          </div>
        </div>

        <div className="relative aspect-[13/10] rounded-xl lg:rounded-2xl overflow-hidden border w-full">
          <Image
            src={props.imageSource}
            alt={props.title + " image"}
            className="object-cover"
            fill
          />
        </div>
      </div>
    </section>
  );
};

export default TextAndImage;
