"use client";

import * as React from "react";
import { useState } from "react";
import { ArrowDownToLine, Check, Copy, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActionDrawerProps } from "@/components/layout/types";

export function ActionDrawer({
  onExport,
  counterOfferDraft,
}: ActionDrawerProps): React.JSX.Element {
  const [showDraft, setShowDraft] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const copyDraft = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(counterOfferDraft);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Next best actions</CardTitle>
          <p className="mt-1 text-[10px] text-slate-500">
            Review and move this RFQ forward
          </p>
        </div>
        <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-400/10 text-indigo-300">
          <ShieldCheck aria-hidden="true" className="size-4" />
        </span>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <Button
          className="h-10 w-full justify-between text-xs"
          onClick={onExport}
          variant="secondary"
        >
          <span className="flex items-center gap-2">
            <ArrowDownToLine aria-hidden="true" className="size-3.5 text-blue-300" />
            Export comparison data
          </span>
          <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[8px] text-slate-400">
            CSV
          </span>
        </Button>
        <Button
          className="h-10 w-full justify-between text-xs"
          onClick={() => {
            setShowDraft((visible) => !visible);
            setCopyStatus("idle");
          }}
          variant="secondary"
        >
          <span className="flex items-center gap-2">
            <Mail aria-hidden="true" className="size-3.5 text-violet-300" />
            Generate counter-offer draft
          </span>
          <span className="font-mono text-[9px] text-slate-500">AI ASSIST</span>
        </Button>

        {showDraft ? (
          <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.035] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-violet-200">
                Draft preview
              </span>
              <Button
                aria-label="Copy draft to clipboard"
                className="h-7 gap-1.5 px-2 text-[10px]"
                onClick={() => void copyDraft()}
                size="sm"
                variant="ghost"
              >
                {copyStatus === "copied" ? (
                  <Check aria-hidden="true" className="size-3 text-emerald-300" />
                ) : (
                  <Copy aria-hidden="true" className="size-3" />
                )}
                {copyStatus === "copied" ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="max-h-28 overflow-y-auto whitespace-pre-wrap text-[10px] leading-relaxed text-slate-400">
              {counterOfferDraft}
            </p>
            {copyStatus === "error" ? (
              <p role="alert" className="mt-2 text-[10px] text-rose-300">
                Clipboard access was blocked. Select and copy the draft manually.
              </p>
            ) : null}
          </div>
        ) : null}
        <p className="pt-1 text-center text-[9px] text-slate-600">
          Actions require human review before sending
        </p>
      </CardContent>
    </Card>
  );
}
