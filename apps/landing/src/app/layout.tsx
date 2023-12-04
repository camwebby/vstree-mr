import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "vstree | home",
  description: "vstree is a community-driven database of VST plugins.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
