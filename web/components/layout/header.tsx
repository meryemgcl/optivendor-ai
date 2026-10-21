"use client";

import * as React from "react";
import Image from "next/image";
import { Building2, Check, ChevronDown, Command } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheck,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { workspaces as defaultWorkspaces } from "@/components/layout/demo-data";
import type { HeaderProps, Workspace } from "@/components/layout/types";

export function Header({
  workspaces = defaultWorkspaces,
  activeWorkspaceId = defaultWorkspaces[0].id,
  onWorkspaceChange,
}: HeaderProps): React.JSX.Element {
  const activeWorkspace =
    workspaces.find((workspace) => workspace.id === activeWorkspaceId) ??
    workspaces[0];

  const handleWorkspaceChange = (workspace: Workspace): void => {
    onWorkspaceChange?.(workspace);
  };

  return (
    <header className="relative z-20 flex min-h-[76px] flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] bg-[#090D16]/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-4 sm:gap-6">
        <Image
          src="/assets/logo.svg"
          alt="OptiVendor.AI"
          width={220}
          height={66}
          priority
          className="h-auto w-[172px] sm:w-[205px]"
        />
        <div className="hidden h-8 w-px bg-white/[0.08] md:block" />
        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 sm:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#10B981] opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-[#10B981]" />
          </span>
          <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-emerald-200">
            AGENT ACTIVE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 text-xs text-slate-500 lg:flex">
          <Command aria-hidden="true" className="size-3.5" />
          <span className="font-mono">RFQ-2024-0842</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label={`Workspace: ${activeWorkspace.name}`}
              className="group flex max-w-[250px] items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-left transition-colors hover:border-blue-400/25 hover:bg-white/[0.06]"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-blue-300">
                <Building2 aria-hidden="true" className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-slate-200">
                  {activeWorkspace.name}
                </span>
                <span className="mt-0.5 block text-[10px] text-slate-500">
                  {activeWorkspace.description}
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className="ml-1 size-4 shrink-0 text-slate-500 transition-transform group-data-[state=open]:rotate-180"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onSelect={() => handleWorkspaceChange(workspace)}
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/[0.05] text-slate-400">
                  <Building2 aria-hidden="true" className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium">
                    {workspace.name}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-slate-500">
                    {workspace.description}
                  </span>
                </span>
                <DropdownMenuCheck checked={workspace.id === activeWorkspace.id} />
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Check aria-hidden="true" className="size-4 text-slate-600" />
              Workspace settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
