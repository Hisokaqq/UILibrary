import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "../ui/badge";

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

  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);

  const itemsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const groups = Object.entries(groupedData);
      const nGroups = groups.length;
      if (nGroups === 0) return;

      const currentGroupItems = groups[selectedGroup][1];
      const nItems = currentGroupItems.length;

      if (e.key === "ArrowRight") {
        setSelectedGroup((prev) => Math.min(prev + 1, nGroups - 1));
        setSelectedItem(0);
      } else if (e.key === "ArrowLeft") {
        setSelectedGroup((prev) => Math.max(prev - 1, 0));
        setSelectedItem(0);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (selectedItem < nItems - 1) {
          setSelectedItem((prev) => prev + 1);
        } else if (selectedGroup < nGroups - 1) {
          setSelectedGroup((prev) => prev + 1);
          setSelectedItem(0);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (selectedItem > 0) {
          setSelectedItem((prev) => prev - 1);
        } else if (selectedGroup > 0) {
          const prevGroupIndex = selectedGroup - 1;
          const prevGroupItems = groups[prevGroupIndex][1];
          setSelectedGroup(prevGroupIndex);
          setSelectedItem(prevGroupItems.length - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [groupedData, selectedGroup, selectedItem]);

  useEffect(() => {
    const groups = Object.entries(groupedData);
    if (groups.length === 0) return;

    const lastGroupIdx = groups.length - 1;
    const lastItemIdx = groups[lastGroupIdx][1].length - 1;

    if (selectedGroup === 0 && selectedItem === 0) {
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (selectedGroup === lastGroupIdx && selectedItem === lastItemIdx) {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
      return;
    }
    const key = `${selectedGroup}-${selectedItem}`;
    const element = itemsRef.current[key];

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [groupedData, selectedGroup, selectedItem]);

  return (
    <div
      ref={containerRef}
      className={cn("rounded-md border overflow-y-scroll px-4 pt-4", className)}
    >
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
