/**
 * Timeline Component
 *
 * A keyboard-accessible, grouped timeline view. It automatically sorts and groups
 * data based on a specified key.
 *
 * Key Features:
 * - **Keyboard Navigation:** Users can use Arrow Keys to navigate between groups (Left/Right) and items (Up/Down).
 * - **Screen Reader Support:** Includes live announcements for group and item selection changes.
 *
 * @template T - The type of data displayed. Must extend { id: string | number }.
 *
 * @param {T[]} data - The array of data objects to display.
 * @param {string} header - The label prefix for groups (e.g., "Month" or "Status") used in accessibility announcements.
 * @param {keyof T} groupBy - The property key to group items by (e.g., "date" or "category").
 * @param {(item: T, isSelected: boolean) => React.ReactNode} render - Function to render a single item. Receives the `isSelected` boolean to style the active item.
 * @param {string} [className] - Optional Tailwind classes for the container.
 * @param {(item: T) => string} [ariaLabel] - Optional function to generate a specific string for screen reader announcements when an item is selected.
 *
 * @example
 * ```tsx
 * <Timeline
 * data={events}
 * header="Date"
 * groupBy="date"
 * className="h-[500px]"
 * ariaLabel={(item) => `Event ${item.title} due on ${item.date}`}
 * render={(item, isSelected) => (
 * <div className={cn("p-2", isSelected ? "bg-blue-100 ring-2" : "bg-white")}>
 * <span className="font-bold">{item.title}</span>
 * </div>
 * )}
 * />
 * ```
 */

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
