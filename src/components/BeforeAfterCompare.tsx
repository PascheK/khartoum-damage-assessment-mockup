// Before/After slider component

import { Slider } from "@radix-ui/react-slider";
import { useRef, useState } from "react";

type BeforeAfterCompareProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
  initial?: number; // 0..100
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function BeforeAfterCompare({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  alt = "",
  initial = 50,
  className,
}: BeforeAfterCompareProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [value, setValue] = useState<number[]>([clamp(initial, 0, 100)]);

  const percent = value[0] ?? 50;
  const hasImages = Boolean(beforeSrc) && Boolean(afterSrc);

  const setFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const next = rect.width === 0 ? 50 : (x / rect.width) * 100;
    setValue([clamp(next, 0, 100)]);
  };

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] overflow-hidden rounded-xl border border-black/10 bg-gray-100 select-none touch-none"
        onPointerDown={(e) => {
          draggingRef.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          setFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}
        aria-label="Before and after image comparison"
      >
        {/* Base (BEFORE) */}
        {hasImages ? (
          <img
            src={beforeSrc}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-gray-500">
            Before image placeholder
          </div>
        )}

        {/* Reveal (AFTER) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${percent}%` }}
        >
          {hasImages ? (
            <img
              src={afterSrc}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-gray-500">
              After image placeholder
            </div>
          )}
        </div>

        {/* Labels */}
        <div className="absolute left-3 top-3 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-xs font-medium text-gray-900 border border-black/10">
          {beforeLabel}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-xs font-medium text-gray-900 border border-black/10">
          {afterLabel}
        </div>

        {/* Divider + handle */}
        <div
          className="absolute inset-y-0"
          style={{ left: `${percent}%` }}
          aria-hidden="true"
        >
          <div className="absolute inset-y-0 w-px -translate-x-1/2 bg-white/90 shadow" />
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2">
            <div className="h-10 w-10 rounded-full bg-white/90 backdrop-blur border border-black/10 shadow grid place-items-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 7L9 12L14 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 7L15 12L10 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* UNOPS registry Slider (keyboard + accessibility) */}
      <div className="mt-4">
        <Slider
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={1}
          aria-label="Comparison slider"
        />
      </div>
    </div>
  );
}
