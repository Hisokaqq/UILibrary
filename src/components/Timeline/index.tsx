import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { useTimelineNavigation } from "./hooks/useTimelineNavigation";
import Hint from "./Hint";
import Group from "./Group";

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
        "rounded-md border overflow-y-scroll px-4 pt-4 relative ",
        className
      )}
    >
      <Hint showHint={showHint} />
      {Object.entries(groupedData).map(([groupKey, items], groupIndex) => {
        const isSelected = groupIndex === selectedGroup;
        return (
          <Group
            key={groupKey}
            groupKey={groupKey}
            groupLength={items.length}
            header={header}
            isSelected={isSelected}
          >
            <div>
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
          </Group>
        );
      })}
    </div>
  );
};

export default Timeline;
