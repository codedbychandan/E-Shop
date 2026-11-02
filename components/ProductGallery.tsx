"use client";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useRef, useState } from "react";
import type { Product } from "@/data/types";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ProductImage";

export function ProductGallery({ product }: { product: Product }) {
  const [idx, setIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const frameRef = useRef<HTMLDivElement>(null);

  const images = product.images.length > 0 ? product.images : [product.images[0]];
  const image = images[idx] ?? images[0];
  const multiple = images.length > 1;

  const go = (dir: 1 | -1) => setIdx((i) => (i + dir + images.length) % images.length);

  const onMove = (e: React.MouseEvent) => {
    const r = frameRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div>
      <div
        ref={frameRef}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={onMove}
        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-3xl border border-line bg-surface2"
      >
        <ProductImage
          src={image}
          alt={product.name}
          eager
          className="h-full w-full"
        />
        {zoomed && (
          <img
            src={image}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full scale-[1.9] object-cover"
            style={{ transformOrigin: origin }}
          />
        )}
        <span
          className={cn(
            "pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-muted shadow-sm backdrop-blur transition-opacity",
            zoomed ? "opacity-0" : "opacity-100"
          )}
        >
          <ZoomIn size={15} />
        </span>

        {multiple && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur transition-all hover:scale-105"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur transition-all hover:scale-105"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {multiple && (
        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-surface2 transition-all",
                i === idx ? "border-brand-600" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <ProductImage src={img} alt={`${product.name} view ${i + 1}`} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
