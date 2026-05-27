import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecurseNow",
  description: "Spaced repetition for DSA problems",
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