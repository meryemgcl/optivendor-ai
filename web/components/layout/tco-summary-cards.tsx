import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Clock3, Coins, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { TcoSummaryCardsProps } from "@/components/layout/types";
import { cn } from "@/lib/utils";

const accentStyles = {
  emerald: {
    icon: "bg-emerald-400/10 text-emerald-300",
    value: "text-emerald-100",
    trend: "text-emerald-300",
  },
  blue: {
    icon: "bg-blue-400/10 text-blue-300",
    value: "text-blue-100",
    trend: "text-blue-300",
  },
  amber: {
    icon: "bg-amber-400/10 text-amber-300",
    value: "text-amber-100",
    trend: "text-amber-300",
  },
};

const metricIcons = {
  "best-price": Coins,
  "fastest-delivery": Clock3,
  "recommended-tco": Sparkles,
} as const;

export function TcoSummaryCards({ metrics }: TcoSummaryCardsProps): React.JSX.Element {
  return (
    <section aria-label="Quote summary" className="grid gap-3 sm:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metricIcons[metric.id as keyof typeof metricIcons] ?? Coins;
        const styles = accentStyles[metric.accent];
        const isRecommended = metric.id === "recommended-tco";

        return (
          <Card
            key={metric.id}
            className={cn(
              "relative overflow-hidden p-4 transition-colors hover:border-blue-400/25",
              isRecommended && "border-amber-400/20 bg-amber-400/[0.035]",
            )}
          >
            {isRecommended ? (
              <span className="absolute right-0 top-0 rounded-bl-lg bg-amber-400/10 px-2 py-1 font-mono text-[8px] font-semibold tracking-wider text-amber-200">
                OPTIMAL TCO
              </span>
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-500">
                {metric.label}
              </span>
              <span className={cn("flex size-7 items-center justify-center rounded-lg", styles.icon)}>
                <Icon aria-hidden="true" className="size-3.5" />
              </span>
            </div>
            <p className={cn("mt-3 font-mono text-xl font-semibold tracking-tight", styles.value)}>
              {metric.value}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[9px] text-slate-500">
              {metric.id === "fastest-delivery" ? (
                <ArrowDownRight aria-hidden="true" className={cn("size-3", styles.trend)} />
              ) : (
                <ArrowUpRight aria-hidden="true" className={cn("size-3", styles.trend)} />
              )}
              <span>{metric.detail}</span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
