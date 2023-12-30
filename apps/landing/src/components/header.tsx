"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Button from "./button";

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAtTopOfPage = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.scrollY < 300;
    }
    return true;
  }, [typeof window !== "undefined" ? window.scrollY : undefined, scrollY]);

  return (
    <header
      className={` shadow-sm w-screen backdrop-blur-lg border-b border-foreground/10 p-5 left-0 top-0 fixed z-[999] duration-300 ease-in-out
    ${isAtTopOfPage ? "bg-foreground/5 " : "bg-foreground/90"}
    `}
    >
      <div className="container px-5 flex items-center justify-between">
        <Link
          className={`rounded-full border-2 border-muted-foreground/10 p-2 px-3 text-xs
          font-semibold uppercase tracking-widest
          duration-500 hover:bg-secondary
          ${
            isAtTopOfPage
              ? "text-foreground"
              : "text-black/90 hover:text-foreground"
          }
          `}
          href={"/"}
        >
          VSTREE
        </Link>

        <div className="items-center gap-x-12 justify-center text-sm text-background/70 hidden lg:flex">
          <Link
            className="text-zinc-500 hover:text-zinc-600 duration-300 ease-in-out"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-zinc-500 hover:text-zinc-600 duration-300 ease-in-out"
            href="#faqs"
          >
            FAQs
          </Link>
          <Link
            className="text-zinc-500 hover:text-zinc-600 duration-300 ease-in-out"
            href="#faqs"
          >
            Contact
          </Link>
        </div>

        <Button variant="secondary">Get started</Button>
        {/* <Link
          href={APP_URL}
          className="bg-primary/10 rounded-full w-fit px-6 py-3 text-xs text-foreground border border-primary/20 hover:bg-primary/20 hover:text-primary duration-300 ease-in-out hover:border-primary/50"
        >
          Get started
        </Link> */}
      </div>
    </header>
  );
};

export default Header;
