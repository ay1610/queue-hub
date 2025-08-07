import React from "react";
import { GridBg } from "@/components/GridBg";

export default function TVLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <GridBg />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
