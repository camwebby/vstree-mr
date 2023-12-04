import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className=" ">
      <div className="container px-5 rounded-2xl bg-secondary/50 border mb-10 flex items-center justify-between border-t border-border py-20">
        <Link href="/" className="text-lg font-medium text-primary">
          vst tree
        </Link>

        

        {/* <Link
          href="https://vst-tree.vercel.app/"
          className="bg-primary/10 rounded-full w-fit px-7 py-2 text-xs text-foreground border border-primary/20"
        >
          Login
        </Link> */}
      </div>
    </footer>
  );
};

export default Footer;
