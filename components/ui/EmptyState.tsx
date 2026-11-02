"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface2 text-muted">
        {icon}
      </div>
      <h3 className="heading-3">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {actionHref && actionLabel && (
          <Button href={actionHref} variant="primary">
            {actionLabel}
          </Button>
        )}
        {onAction && actionLabel && (
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        )}
        {onSecondary && secondaryLabel && (
          <Button onClick={onSecondary} variant="outline">
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
