import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="container mt-20 border rounded-xl shadow-xl bg-foreground/5">
      <div className="px-5 items-center hidden lg:flex justify-between py-12">
        <Link href="/" className="text-base font-semibold text-foreground ">
          <span>vstree</span>
        </Link>

        <ul className="items-center gap-x-12 justify-center text-sm text-background/70 hidden lg:flex">
          <li>
            <Link
              className="text-zinc-200 hover:text-zinc-600 duration-300 ease-in-out"
              href="#features"
            >
              Features
            </Link>
          </li>
          <li>
            <Link
              className="text-zinc-200 hover:text-zinc-600 duration-300 ease-in-out"
              href="#faqs"
            >
              FAQs
            </Link>
          </li>
          <li>
            <Link
              className="text-zinc-200 hover:text-zinc-600 duration-300 ease-in-out"
              href="mailto:contact@vstree.app"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <hr className="hidden lg:block" />
      <div className="container px-5 flex flex-col lg:flex-row items-center justify-between py-10 text-sm">
        <p className="hidden lg:block">Made with ☕ in London</p>

        <div className="flex flex-col lg:flex-row items-center gap-4">
          <Link href="/terms-conditions.pdf" className="mr-5">
            Terms
          </Link>

          <Link href="/privacy.pdf" className="mr-5">
            Privacy
          </Link>

          <p className="hidden lg:block opacity-30">|</p>

          <div>
            &copy; {new Date().getFullYear()} vstree. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
