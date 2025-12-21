import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "../ui/badge";

interface GroupProps {
  groupKey: string;
  groupLength: number;
  header: string;
  isSelected: boolean;
  children: React.ReactNode;
}

const Group = ({
  groupKey,
  groupLength,
  header,
  isSelected,
  children,
}: GroupProps) => {
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
          <span className="font-bold">{groupLength}</span>items
        </Badge>
      </div>
      <div className="flex flex-col gap-2 p-2">{children}</div>
    </div>
  );
};

export default Group;
