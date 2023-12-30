import { APP_URL } from "@/consts/envs";
import Link from "next/link";
import React from "react";

const Button: React.FC<{
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
}> = ({ variant = "primary", ...props }) => {
  if (variant === "primary") {
    return (
      <Link
        href={APP_URL}
        style={{
          background:
            "linear-gradient(161deg, rgba(255, 255, 255, 0.28) -43.24%, rgba(255, 255, 255, 0.20) 11.09%, rgba(255, 255, 255, 0.40) 106.8%)",
          boxShadow: "0px 4.569px 34.269px 0px rgba(215, 228, 255, 0.25)",
        }}
        className="rounded-full w-fit px-12 py-3 text-sm text-foreground border border-foreground/20
        hover:border-foreground/40 duration-200 ease-in-out
        "
      >
        {props.children}
      </Link>
    );
  }

  return (
    <Link
      href={APP_URL}
      className="rounded-full bg-primary w-fit px-7 lg:px-12 py-2 text-xs lg:py-3 lg:text-sm text-foreground border border-foreground/20
        hover:border-foreground/40 duration-200 ease-in-out hover:ring-2 hover:ring-primary/50 hover:ring-offset-2 hover:ring-offset-primary/50"
    >
      {props.children}
    </Link>
  );
};

export default Button;
