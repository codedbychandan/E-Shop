"use client";

import { Package } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/** Image with a graceful branded fallback if the remote asset fails to load. */
export function ProductImage({ src, alt, className, eager }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-surface2 to-surface text-muted",
          className
        )}
        role="img"
        aria-label={alt}
      >
        <Package size={28} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      draggable={false}
      className={cn("object-cover", className)}
    />
  );
}
