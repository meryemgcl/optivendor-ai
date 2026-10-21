import * as React from "react";

import { Header } from "@/components/layout/header";
import { SplitViewContainer } from "@/components/layout/split-view-container";

export default function HomePage(): React.JSX.Element {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090D16] text-slate-100">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-64 size-[560px] rounded-full bg-blue-600/[0.07] blur-[140px]" />
        <div className="absolute -right-64 top-[35%] size-[520px] rounded-full bg-indigo-600/[0.055] blur-[150px]" />
      </div>
      <div className="relative z-10">
        <Header />
        <SplitViewContainer />
      </div>
    </div>
  );
}
