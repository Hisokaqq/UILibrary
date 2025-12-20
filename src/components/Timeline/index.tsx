import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { Badge } from "../ui/badge";

interface TimelineProps<T> {
  data: T[];
  header: string;
  groupBy: keyof T;
  render: (item: T) => React.ReactNode;
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
    return data.reduce((acc, item) => {
      const key = String(item[groupBy]);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }, [data, groupBy]);

  return (
    <div className={cn("rounded-md border overflow-y-scroll p-4", className)}>
      {Object.entries(groupedData).map(([groupKey, items]) => (
        <div key={groupKey}>
          <div className="flex items-center gap-2">
            <div className="border bg-muted/10 rounded-sm p-2">
              <p className="text-xs font-medium uppercase tracking-wide">
                {header}
              </p>
              <p className="text-lg font-semibold">{groupKey}</p>
            </div>
            <div className="flex flex-1 bg-primary/10 h-0.5"></div>
            <Badge variant="outline">
              <span className="font-bold">{items.length}</span>items
            </Badge>
          </div>
          <div className="flex flex-col gap-2 p-2">
            {items.map((item) => render(item))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
