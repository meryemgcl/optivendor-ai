import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Maximize2,
  MoreHorizontal,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DocumentCanvasProps, Supplier } from "@/components/layout/types";
import { cn } from "@/lib/utils";

const supplierStyles: Record<
  Supplier["color"],
  { badge: string; dot: string; highlight: string }
> = {
  blue: {
    badge: "bg-blue-400/10 text-blue-200",
    dot: "bg-blue-400",
    highlight: "border-amber-300 bg-amber-300/10 shadow-[0_0_24px_rgba(252,211,77,0.18)]",
  },
  violet: {
    badge: "bg-violet-400/10 text-violet-200",
    dot: "bg-violet-400",
    highlight: "border-violet-300 bg-violet-300/10 shadow-[0_0_24px_rgba(196,181,253,0.18)]",
  },
  emerald: {
    badge: "bg-emerald-400/10 text-emerald-200",
    dot: "bg-emerald-400",
    highlight: "border-emerald-300 bg-emerald-300/10 shadow-[0_0_24px_rgba(110,231,183,0.18)]",
  },
};

export function DocumentCanvas({
  suppliers,
  activeSupplierId,
  activeBoundingBox,
  onSupplierChange,
}: DocumentCanvasProps): React.JSX.Element {
  const activeSupplier =
    suppliers.find((supplier) => supplier.id === activeSupplierId) ?? suppliers[0];
  const activeStyles = supplierStyles[activeSupplier.color];
  const boxStyle = {
    left: `${activeBoundingBox.xMin * 100}%`,
    top: `${activeBoundingBox.yMin * 100}%`,
    width: `${(activeBoundingBox.xMax - activeBoundingBox.xMin) * 100}%`,
    height: `${(activeBoundingBox.yMax - activeBoundingBox.yMin) * 100}%`,
  };

  return (
    <Card className="flex min-h-[620px] flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
            <FileText aria-hidden="true" className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-100">Source documents</p>
            <p className="mt-0.5 text-[10px] text-slate-500">
              Visual grounding viewer
            </p>
          </div>
        </div>
        <Button
          aria-label="Document options"
          className="size-8 text-slate-500"
          size="icon"
          variant="ghost"
        >
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </Button>
      </div>

      <div
        aria-label="Supplier documents"
        className="flex gap-1 overflow-x-auto border-b border-white/[0.06] px-4 pt-2 sm:px-5"
        role="tablist"
      >
        {suppliers.map((supplier) => (
          <button
            key={supplier.id}
            aria-selected={supplier.id === activeSupplier.id}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-xs transition-colors",
              supplier.id === activeSupplier.id
                ? "border-blue-400 text-slate-100"
                : "border-transparent text-slate-500 hover:text-slate-300",
            )}
            onClick={() => onSupplierChange(supplier.id)}
            role="tab"
            type="button"
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded text-[9px] font-bold",
                supplierStyles[supplier.color].badge,
              )}
            >
              {supplier.initials}
            </span>
            {supplier.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/10 px-4 py-2 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 text-[11px] text-slate-400">
          <FileText aria-hidden="true" className="size-3.5 shrink-0 text-slate-500" />
          <span className="truncate">{activeSupplier.documentName}</span>
          <span className="hidden rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[9px] text-slate-500 sm:inline">
            PDF
          </span>
        </div>
        <div className="ml-3 flex shrink-0 items-center gap-1">
          <Button aria-label="Zoom out" className="size-7" size="icon" variant="ghost">
            <ZoomOut aria-hidden="true" className="size-3.5" />
          </Button>
          <span className="min-w-10 text-center font-mono text-[10px] text-slate-500">
            100%
          </span>
          <Button aria-label="Zoom in" className="size-7" size="icon" variant="ghost">
            <ZoomIn aria-hidden="true" className="size-3.5" />
          </Button>
          <span className="mx-1 h-4 w-px bg-white/[0.08]" />
          <Button aria-label="Fit document to view" className="size-7" size="icon" variant="ghost">
            <Maximize2 aria-hidden="true" className="size-3.5" />
          </Button>
          <Button aria-label="Download source document" className="size-7" size="icon" variant="ghost">
            <Download aria-hidden="true" className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#080C13] px-4 py-6 sm:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#64748b_0.65px,transparent_0.65px)] [background-size:18px_18px]" />
        <div className="relative w-full max-w-[610px]">
          <div className="absolute -inset-8 rounded-full bg-blue-500/[0.04] blur-3xl" />
          <article
            aria-label={`${activeSupplier.name} quotation preview`}
            className="relative aspect-[1/1.2] w-full overflow-hidden rounded-sm border border-slate-300/20 bg-[#f8fafc] p-[6%] text-slate-700 shadow-[0_24px_90px_rgba(0,0,0,0.45)] sm:aspect-[1.12/1]"
          >
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="font-sans text-[clamp(12px,1.25vw,17px)] font-bold tracking-tight text-slate-900">
                  {activeSupplier.name}
                </p>
                <p className="mt-1 text-[clamp(7px,0.7vw,10px)] text-slate-500">
                  INDUSTRIAL COMPONENTS &amp; SYSTEMS
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[clamp(8px,0.8vw,11px)] font-semibold text-slate-700">
                  QUOTE
                </p>
                <p className="mt-1 font-mono text-[clamp(7px,0.7vw,10px)] text-slate-500">
                  Q-2024-0842
                </p>
              </div>
            </div>

            <div className="mt-[7%] flex justify-between text-[clamp(7px,0.72vw,10px)] text-slate-500">
              <div>
                <p className="font-semibold uppercase tracking-wider text-slate-400">
                  Prepared for
                </p>
                <p className="mt-1 font-medium text-slate-700">Northstar Manufacturing</p>
              </div>
              <div className="text-right">
                <p className="font-semibold uppercase tracking-wider text-slate-400">
                  Quote date
                </p>
                <p className="mt-1 font-mono text-slate-700">Oct 18, 2024</p>
              </div>
            </div>

            <div className="mt-[8%] border-y border-slate-200 py-2">
              <div className="grid grid-cols-[1fr_2.2fr_.7fr_1fr] gap-2 text-[clamp(6px,0.63vw,9px)] font-semibold uppercase tracking-wider text-slate-400">
                <span>Item code</span>
                <span>Description</span>
                <span>Qty</span>
                <span className="text-right">Unit price</span>
              </div>
            </div>

            <div className="relative mt-1 space-y-[2.3%]">
              {[
                ["SM-2400", "Servo motor assembly", "24", "$428.50"],
                ["DC-1180", "Variable drive controller", "12", "$785.00"],
                ["BK-0902", "Precision bearing kit", "48", "$96.25"],
                ["SN-3321", "Optical sensor module", "18", "$215.00"],
              ].map(([code, description, quantity, price]) => (
                <div
                  key={code}
                  className="grid grid-cols-[1fr_2.2fr_.7fr_1fr] items-center gap-2 py-[1.3%] text-[clamp(7px,0.72vw,10px)]"
                >
                  <span className="font-mono text-slate-500">{code}</span>
                  <span className="truncate font-medium text-slate-700">
                    {description}
                  </span>
                  <span className="font-mono text-slate-500">{quantity}</span>
                  <span className="text-right font-mono font-medium text-slate-700">
                    {price}
                  </span>
                </div>
              ))}
              <div
                aria-label={`Visual grounding highlight, page ${activeBoundingBox.pageNumber}`}
                className={cn(
                  "pointer-events-none absolute rounded-[2px] border-2 transition-all duration-500",
                  activeStyles.highlight,
                )}
                style={boxStyle}
              >
                <span className="absolute -top-5 right-0 whitespace-nowrap rounded bg-amber-300 px-1.5 py-0.5 font-mono text-[8px] font-bold text-slate-950">
                  MATCH · 98.2%
                </span>
              </div>
            </div>

            <div className="absolute bottom-[8%] left-[6%] right-[6%] border-t border-slate-200 pt-3">
              <div className="ml-auto grid max-w-[50%] grid-cols-2 gap-y-1.5 text-[clamp(7px,0.72vw,10px)]">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-right font-mono text-slate-700">$18,420.00</span>
                <span className="text-slate-500">Payment terms</span>
                <span className="text-right font-mono text-slate-700">Net 90 days</span>
                <span className="font-semibold text-slate-800">Total USD</span>
                <span className="text-right font-mono font-bold text-slate-900">
                  $18,420.00
                </span>
              </div>
            </div>
          </article>
        </div>

        <div className="relative mt-5 flex w-full max-w-[610px] items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className={cn("size-1.5 rounded-full", activeStyles.dot)} />
            Extracted value linked to source
          </span>
          <span className="flex items-center gap-2">
            <Button aria-label="Previous page" className="size-7" size="icon" variant="ghost">
              <ChevronLeft aria-hidden="true" className="size-3.5" />
            </Button>
            <span className="font-mono">01 / 04</span>
            <Button aria-label="Next page" className="size-7" size="icon" variant="ghost">
              <ChevronRight aria-hidden="true" className="size-3.5" />
            </Button>
          </span>
        </div>
      </div>
    </Card>
  );
}
