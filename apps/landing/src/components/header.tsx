import { APP_URL } from "@/consts/envs";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="bg-primary/5 w-screen backdrop-blur-md border-b border-white/10 p-5 left-0 top-0 fixed z-[999]">
      <div className="container px-5 flex items-center justify-between">
        <Link href="/" className="text-base font-bold text-primary">
          <span>VST TREE</span>
        </Link>

        <>
          <div className="items-center gap-x-12 justify-center text-sm text-white/80 hidden lg:flex">
            <Link
              className="hover:text-primary duration-300 ease-in-out"
              href="#pricing"
            >
              Pricing
            </Link>
            <Link
              className="hover:text-primary duration-300 ease-in-out"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="hover:text-primary duration-300 ease-in-out"
              href="#faqs"
            >
              FAQs
            </Link>
          </div>
        </>

        <Link
          href={APP_URL}
          className="bg-primary/10 rounded-full w-fit px-6 py-3 text-xs text-foreground border border-primary/20 hover:bg-primary/20 hover:text-primary duration-300 ease-in-out hover:border-primary/50"
        >
          Get started
        </Link>
      </div>
    </header>
  );
};

export default Header;
