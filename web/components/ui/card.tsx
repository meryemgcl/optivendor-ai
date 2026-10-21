import * as React from "react";

import { cn } from "@/lib/utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "rounded-2xl border border-blue-500/15 bg-slate-900/60 backdrop-blur-md",
        className,
      )}
      {...props}
    />
  );
}

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({
  className,
  ...props
}: CardHeaderProps): React.JSX.Element {
  return <div className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />;
}

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({ className, ...props }: CardTitleProps): React.JSX.Element {
  return (
    <h2
      className={cn("text-sm font-semibold tracking-wide text-slate-100", className)}
      {...props}
    />
  );
}

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, ...props }: CardContentProps): React.JSX.Element {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}
