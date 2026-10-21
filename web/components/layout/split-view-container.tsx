"use client";

import * as React from "react";
import { useState } from "react";
import { Activity, Sparkles } from "lucide-react";

import { ActionDrawer } from "@/components/layout/action-drawer";
import { DocumentCanvas } from "@/components/layout/document-canvas";
import {
  counterOfferDraft,
  lineItems,
  suppliers,
  tcoMetrics,
} from "@/components/layout/demo-data";
import { RfqComparison } from "@/components/layout/rfq-comparison";
import { TcoSummaryCards } from "@/components/layout/tco-summary-cards";
import type { QuoteLineItem, SplitViewContainerProps } from "@/components/layout/types";
import { cn } from "@/lib/utils";

function downloadComparisonCsv(): void {
  const header = ["Item Code", "Description", "Quantity", ...suppliers.map((supplier) => supplier.name)];
  const rows = lineItems.map((item) => [
    item.code,
    item.description,
    String(item.quantity),
    ...suppliers.map((supplier) => String(item.prices[supplier.id])),
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "optivendor-rfq-comparison.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SplitViewContainer({
  className,
}: SplitViewContainerProps): React.JSX.Element {
  const [activeSupplierId, setActiveSupplierId] = useState(suppliers[0].id);
  const [activeLineItem, setActiveLineItem] = useState<QuoteLineItem>(lineItems[0]);

  const selectLineItem = (item: QuoteLineItem): void => {
    setActiveLineItem(item);
    setActiveSupplierId(suppliers[0].id);
  };

  return (
    <main
      className={cn(
        "mx-auto grid w-full max-w-[1800px] grid-cols-1 gap-4 px-4 py-5 sm:px-6 lg:min-h-[calc(100vh-76px)] lg:grid-cols-2 lg:gap-5 lg:px-8 lg:py-6",
        className,
      )}
    >
      <section aria-label="Quote source document" className="flex min-w-0 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-blue-300">
                DOCUMENT REVIEW
              </span>
              <span className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[8px] text-slate-500">
                03 FILES
              </span>
            </div>
            <h1 className="mt-1 text-base font-semibold tracking-tight text-white">
              Supplier proposals
            </h1>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-300">
            <Activity aria-hidden="true" className="size-3.5" />
            Grounding active
          </span>
        </div>
        <DocumentCanvas
          activeBoundingBox={activeLineItem.boundingBox}
          activeSupplierId={activeSupplierId}
          onSupplierChange={setActiveSupplierId}
          suppliers={suppliers}
        />
      </section>

      <section aria-label="Quote comparison and actions" className="flex min-w-0 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-indigo-300">
                DECISION INTELLIGENCE
              </span>
              <span className="flex items-center gap-1 rounded border border-indigo-400/15 bg-indigo-400/[0.05] px-1.5 py-0.5 text-[8px] text-indigo-200">
                <Sparkles aria-hidden="true" className="size-2.5" />
                ANALYZED
              </span>
            </div>
            <h2 className="mt-1 text-base font-semibold tracking-tight text-white">
              Quote comparison
            </h2>
          </div>
          <span className="hidden font-mono text-[9px] text-slate-600 sm:inline">
            UPDATED JUST NOW
          </span>
        </div>
        <div className="space-y-4">
          <TcoSummaryCards metrics={tcoMetrics} />
          <RfqComparison
            activeLineItemId={activeLineItem.id}
            lineItems={lineItems}
            onSelectLineItem={selectLineItem}
            suppliers={suppliers}
          />
          <ActionDrawer counterOfferDraft={counterOfferDraft} onExport={downloadComparisonCsv} />
        </div>
      </section>
    </main>
  );
}
