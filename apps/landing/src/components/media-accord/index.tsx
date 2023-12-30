"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useMediaQuery } from "@mantine/hooks";
import { featuresContent } from "./consts";

const NestedImageMobile = ({
  src,
  alt,
  className,
  selected,
  layoutId,
}: {
  src: string;
  alt: string;
  className?: string;
  layoutId?: string;
  selected?: boolean;
}) => {
  // 1024 px
  const matches = useMediaQuery("(max-width: 64em)");

  return (
    <motion.div
      layoutId={layoutId}
      animate={{
        height: matches && selected ? "100%" : "0",
        marginTop: matches && selected ? "28px" : "0px",
        marginBottom: matches && selected ? "28px" : "0px",
        opacity: matches && selected ? 1 : 0,
      }}
      exit={{
        height: selected ? "100%" : "0%",
        opacity: selected ? 1 : 0,
      }}
      className={`rounded-md aspect-square block lg:hidden w-full overflow-hidden relative ${
        className ? className : ""
      }`}
    >
      <Image
        loading="lazy"
        src={src}
        alt={alt}
        fill
        className="object-contain w-full h-full"
      />
    </motion.div>
  );
};

const NestedImageDesktop = ({
  src,
  alt,
  className,
  layoutId,
}: {
  src: string;
  alt: string;
  className?: string;
  layoutId?: string;
  selected?: boolean;
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      className={`rounded-lg border border-border shadow-white aspect-square hidden lg:block w-full overflow-hidden relative ${
        className ? className : ""
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain w-full h-full"
      />
    </motion.div>
  );
};

const MediaAccord = ({
  data,
  id,
}: {
  data: typeof featuresContent;
  id?: string;
}) => {
  const [selected, setSelected] = useState(0);

  return (
    <section
      id={id}
      className="py-16  lg:py-32 relative z-20 overflow-hidden text-background bg-foreground border-y border-muted-foreground/20"
    >
      <div className="container my-12 flex lg:justify-center items-center">
        <div>
          <p className="text-primary text-left lg:text-center">Features</p>
          <h2 className="text-3xl  lg:max-w-sm lg:text-5xl font-bold text-background/90  text-left lg:text-center text-balance">
            VST quick actions
          </h2>
        </div>
      </div>

      <div className="container grid grid-cols-12 place-content-center">
        <LayoutGroup>
          <div className="col-span-12 lg:col-span-5 my-auto">
            {data.map((item, i) => (
              <motion.button
                layout="position"
                key={i}
                onClick={() =>
                  selected === i ? setSelected(-1) : setSelected(i)
                }
                className={`block w-full cursor-pointer border-b
                border-background/20 ${i === selected ? "" : ""}`}
                layoutId={`item-${i}`}
                transition={{ duration: 0.5, ease: [0.5, 0, 0.24, 1] }}
              >
                <div
                  className={`px-3 lg:p-8
                ${i === 0 ? "pb-6" : "py-10"}
                `}
                >
                  <div className="flex items-center justify-between text-left">
                    <motion.h3
                      layout="position"
                      layoutId={`title-${i}`}
                      className="text-2xl lg:text-3xl font-display"
                    >
                      {item.title}
                    </motion.h3>
                    <motion.svg
                      animate={{
                        rotate: i === selected ? 180 : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.5, 0, 0.24, 1],
                      }}
                      className={`shrink-0 text-zinc-400 ${""}`}
                      width="23"
                      height="9"
                      viewBox="0 0 23 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1 1L11.7838 8L22 1" stroke="currentColor" />
                    </motion.svg>
                  </div>
                  <AnimatePresence>
                    <NestedImageMobile
                      src={item.image.src}
                      alt={item.image.alt}
                      selected={i === selected}
                      layoutId={`selected-image-mobile-${i}`}
                    />
                  </AnimatePresence>
                  <AnimatePresence>
                    <motion.p
                      layout="size"
                      layoutId={`copy-${i}`}
                      animate={{
                        height: i === selected ? "100%" : "0",
                        opacity: i === selected ? 1 : 0,
                      }}
                      exit={{
                        height: i === selected ? "100%" : "0%",
                        opacity: i === selected ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.5, 0, 0.24, 1],
                      }}
                      className={` text-left lg:mt-3 pointer-events-none text-background/60
                    `}
                    >
                      {item.copy}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.button>
            ))}
          </div>

          <>
            <div className="lg:col-span-1 hidden lg:block"></div>
            <div className="col-span-5 hidden lg:block">
              <NestedImageDesktop
                layoutId={`selected-image-desktop`}
                src={data[selected < 0 ? 0 : selected]?.image.src}
                alt={data[selected]?.image.alt}
              />
              <div className="col-span-1 hidden lg:block"></div>
            </div>
          </>
        </LayoutGroup>
      </div>
    </section>
  );
};

export default MediaAccord;
