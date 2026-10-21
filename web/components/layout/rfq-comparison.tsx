import * as React from "react";
import { ArrowUp, BadgeCheck, CircleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RfqComparisonProps, Supplier } from "@/components/layout/types";
import { cn } from "@/lib/utils";

const supplierHeaderStyles: Record<Supplier["color"], string> = {
  blue: "bg-blue-400/10 text-blue-200",
  violet: "bg-violet-400/10 text-violet-200",
  emerald: "bg-emerald-400/10 text-emerald-200",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function RfqComparison({
  suppliers,
  lineItems,
  activeLineItemId,
  onSelectLineItem,
}: RfqComparisonProps): React.JSX.Element {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>RFQ comparison matrix</CardTitle>
          <p className="mt-1 text-[10px] text-slate-500">
            4 line items · normalized to USD
          </p>
        </div>
        <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 font-mono text-[9px] text-slate-400">
          3 SUPPLIERS
        </span>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 pb-0">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="border-y border-white/[0.06] bg-white/[0.015]">
              <th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Line item
              </th>
              <th className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Qty
              </th>
              {suppliers.map((supplier) => (
                <th
                  key={supplier.id}
                  className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500"
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2 py-1 normal-case tracking-normal",
                      supplierHeaderStyles[supplier.color],
                    )}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                    {supplier.name.split(" ")[0]}
                  </span>
                </th>
              ))}
              <th className="px-5 py-3 text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Variance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.045]">
            {lineItems.map((item) => {
              const isActive = item.id === activeLineItemId;

              return (
                <tr
                  key={item.id}
                  className={cn(
                    "transition-colors hover:bg-white/[0.025]",
                    isActive && "bg-blue-500/[0.055]",
                  )}
                >
                  <td className="px-5 py-3">
                    <button
                      aria-pressed={isActive}
                      className="group text-left"
                      onClick={() => onSelectLineItem(item)}
                      type="button"
                    >
                      <span className="block text-xs font-medium text-slate-200 group-hover:text-blue-200">
                        {item.description}
                      </span>
                      <span className="mt-1 block font-mono text-[9px] text-slate-500">
                        {item.code}
                      </span>
                    </button>
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-[10px] text-slate-400">
                    {item.quantity}{" "}
                    <span className="font-sans text-[9px] text-slate-600">
                      {item.unit}
                    </span>
                  </td>
                  {suppliers.map((supplier) => {
                    const price = item.prices[supplier.id];
                    const isLowest =
                      price === Math.min(...Object.values(item.prices));

                    return (
                      <td
                        key={supplier.id}
                        className={cn(
                          "px-3 py-3 text-right font-mono text-[10px]",
                          isLowest ? "font-semibold text-emerald-300" : "text-slate-300",
                        )}
                      >
                        {currencyFormatter.format(price)}
                      </td>
                    );
                  })}
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex items-center gap-0.5 font-mono text-[10px] text-amber-300">
                      <ArrowUp aria-hidden="true" className="size-3" />
                      {item.variance.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-3 text-[9px] text-slate-500">
          <span className="flex items-center gap-1">
            <BadgeCheck aria-hidden="true" className="size-3 text-emerald-400" />
            Verified
          </span>
          <span className="flex items-center gap-1">
            <CircleAlert aria-hidden="true" className="size-3 text-amber-400" />
            Review needed
          </span>
        </div>
        <span className="text-[9px] text-slate-600">
          Select an item to view its source
        </span>
      </div>
    </Card>
  );
}
