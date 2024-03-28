"use client";

import { faqs } from "@/content/faqs";
import { motion } from "framer-motion";
import { useState } from "react";

export const FAQItem = ({ ...props }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <button onClick={() => setOpen(!open)} key={props.index}>
      <div className="accordion -mt-[1px] py-[2rem] border-y border-border/10 hover:border-b-foreground duration-200">
        <div className="accordion-title-wrapper">
          <div className="accordion-title-grid grid gap-4 items-center grid-cols-[1fr_30px]">
            <h3 className="text-[0.95rem] lg:text-lg text-left text-foreground">
              {props.faq.question}
            </h3>
            <div
              className="accordion-icon duration-300 ease-in-out"
              style={{ rotate: open ? "45deg" : "0deg" }}
            >
              <div className="icon-1x1-default w-embed">
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 30 31"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.75 14.25V6.75H16.25V14.25H23.75V16.75H16.25V24.25H13.75V16.75H6.25V14.25H13.75Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <motion.div
          className="overflow-hidden "
          animate={{ height: open ? "100%" : "0px" }}
          transition={{
            ease: [0.19, 1, 0.22, 1],
            duration: 0.75,
          }}
          style={{ width: "100%" }}
        >
          <div className="accordion-content pt-[1.5rem] w-full">
            <p className="text-muted-foreground text-sm text-left w-full">
              {props.faq.answer}
              <br />
            </p>
          </div>
        </motion.div>
      </div>
    </button>
  );
};

const FAQs = () => {
  return (
    <section
      id="faqs"
      className="bg-background text-foreground py-16 lg:py-32 relative"
    >
      <div className="container relative z-20">
        <div className="grid grid-cols-1 gap-y-5 md:grid-cols-2 ">
          <motion.div
            viewport={{ once: true }}
            initial="hidden"
            whileInView="visible"
            className="faq-grid-left animation-ting relative "
          >
            <div className="top-10 h-fit">
              <div className="margin-bottom margin-large">
                <h2 className="text-3xl lg:text-5xl font-medium">
                  Frequently
                  <br /> asked questions
                </h2>
              </div>
            </div>
          </motion.div>
          <div className="faq-grid-right">
            <div className="faq">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
