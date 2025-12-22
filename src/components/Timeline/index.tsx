import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { useTimelineNavigation } from "./hooks/useTimelineNavigation";
import Hint from "./components/Hint";
import Group from "./components/Group";

interface TimelineProps<T> {
  data: T[];
  header: string;
  groupBy: keyof T;
  render: (item: T, isSelected: boolean) => React.ReactNode;
  className?: string;
  ariaLabel?: (item: T) => string;
}

const Timeline = <T extends { id: string | number }>({
  data,
  header,
  groupBy,
  render,
  className,
  ariaLabel,
}: TimelineProps<T>) => {
  const groupedData = useMemo(() => {
    return data
      .sort((a, b) => String(a[groupBy]).localeCompare(String(b[groupBy])))
      .reduce((acc, item) => {
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

  const announcement = useMemo(() => {
    const groups = Object.entries(groupedData);
    if (groups.length === 0) return "Timeline empty";

    const [currentGroupKey, currentItems] = groups[selectedGroup];
    const currentItem = currentItems[selectedItem];

    const itemText =
      ariaLabel && currentItem
        ? ariaLabel(currentItem)
        : `Item ${selectedItem + 1}`;

    return `Group ${header} ${currentGroupKey}, ${currentItems.length} items. Selected: ${itemText}`;
  }, [selectedGroup, selectedItem, groupedData, header, ariaLabel]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "rounded-md border overflow-y-scroll px-4 pt-4 relative ",
        className
      )}
    >
      <Hint showHint={showHint} />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
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
