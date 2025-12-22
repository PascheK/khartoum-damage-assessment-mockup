"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

type Phase = "pre" | "post";

type PrePostMenuProps = {
  value: Phase;
  onChange: (next: Phase) => void;
  className?: string;
};

export function PrePostMenu({ value, onChange, className }: PrePostMenuProps) {
  return (
    <div
      className={[
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-xl",
        className ?? "",
      ].join(" ")}
    >
      <div className="rounded-full bg-white/80 backdrop-blur border border-black/10 shadow-sm p-2">
        <ButtonGroup className="w-full" aria-label="Switch phase">
          <Button
            type="button"
            variant={value === "pre" ? "default" : "secondary"}
            className="flex-1 rounded-full"
            onClick={() => onChange("pre")}
          >
            Pre-conflict
          </Button>
          <Button
            type="button"
            variant={value === "post" ? "default" : "secondary"}
            className="flex-1 rounded-full"
            onClick={() => onChange("post")}
          >
            Post-conflict
          </Button>
        </ButtonGroup>
      </div>

      <p className="mt-2 text-center text-xs text-gray-500">
        Switch phase to load a different story in the map.
      </p>
    </div>
  );
}