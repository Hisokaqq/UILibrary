import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { Badge } from "../ui/badge";
import { useTimelineNavigation } from "./hooks/useTimelineNavigation";
import Hint from "./Hint";

interface TimelineProps<T> {
  data: T[];
  header: string;
  groupBy: keyof T;
  render: (item: T, isSelected: boolean) => React.ReactNode;
  className?: string;
}

const Timeline = <T extends { id: string | number }>({
  data,
  header,
  groupBy,
  render,
  className,
}: TimelineProps<T>) => {
  const groupedData = useMemo(() => {
    return data.sort().reduce((acc, item) => {
      const key = String(item[groupBy]);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }, [data, groupBy]);

  const { selectedGroup, selectedItem, containerRef, itemsRef, showHint } =
    useTimelineNavigation({ groupedData });

  return (
    <div
      ref={containerRef}
      className={cn(
        "rounded-md border overflow-y-scroll px-4 pt-4 relative",
        className
      )}
    >
      <Hint showHint={showHint} />
      {Object.entries(groupedData).map(([groupKey, items], groupIndex) => {
        const isSelected = groupIndex === selectedGroup;
        return (
          <div
            key={groupKey}
            className={cn(
              "mb-6 transition-all duration-300 rounded-lg p-2",
              isSelected
                ? "bg-blue-50/50 ring-2 ring-blue-500 ring-offset-2"
                : "opacity-70 hover:opacity-100"
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={cn(
                  "border rounded-sm p-2 transition-colors",
                  isSelected ? "bg-blue-100 border-blue-200" : "bg-muted/10"
                )}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {header}
                </p>
                <p
                  className={cn(
                    "text-lg font-semibold",
                    isSelected && "text-blue-700"
                  )}
                >
                  {groupKey}
                </p>
              </div>
              <div
                className={cn(
                  "flex flex-1 h-0.5",
                  isSelected ? "bg-blue-200" : "bg-primary/10"
                )}
              ></div>
              <Badge variant={isSelected ? "default" : "outline"}>
                <span className="font-bold">{items.length}</span>items
              </Badge>
            </div>
            <div className="flex flex-col gap-2 p-2">
              {items.map((item, itemIndex) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    itemsRef.current[`${groupIndex}-${itemIndex}`] = el;
                  }}
                >
                  {render(item, itemIndex === selectedItem && isSelected)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
