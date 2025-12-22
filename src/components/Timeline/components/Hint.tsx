import React from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";

const Hint = ({ showHint }: { showHint: boolean }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-center bg-muted/40 backdrop-blur-[1px] transition-opacity duration-500",
        showHint ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="bg-background shadow-lg rounded-xl p-6 text-center space-y-4">
        <p className="font-semibold">Keyboard Navigation</p>
        <div className="flex gap-4 justify-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Groups</span>
            <div className="flex gap-1">
              <Kbd>
                <ArrowLeft size={14} />
              </Kbd>
              <Kbd>
                <ArrowRight size={14} />
              </Kbd>
            </div>
          </div>
          <div className="w-px h-10"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Items</span>
            <div className="flex gap-1">
              <Kbd>
                <ArrowUp size={14} />
              </Kbd>
              <Kbd>
                <ArrowDown size={14} />
              </Kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hint;
