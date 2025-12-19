import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  accessor: keyof T;
  header: string;

  render?: (item: T) => React.ReactNode;
}

interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
}

const PAGE_SIZE = 15;

export const DataGrid = <T extends { id: string | number }>({
  data,
  columns,
  className,
}: DataGridProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const visibleData = useMemo(() => {
    let result = [...data];

    Object.keys(filters).forEach((key) => {
      const filterText = filters[key].toLowerCase();
      if (filterText) {
        result = result.filter((item) =>
          String(item[key as keyof T])
            .toLowerCase()
            .includes(filterText)
        );
      }
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, sortConfig, filters]);

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilter = (key: keyof T, value: string) => {
    setFilters((prev) => ({ ...prev, [key as string]: value }));
    setPage(1);
  };

  const nPages = Math.ceil(visibleData.length / PAGE_SIZE);
  const selectedData = visibleData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.accessor)}>
                  <div className="space-y-2 py-2">
                    <button
                      onClick={() => handleSort(col.accessor)}
                      className="font-bold hover:text-blue-600 transition duration-300 flex items-center gap-1"
                    >
                      {col.header}
                      {sortConfig.key === col.accessor && (
                        <span>
                          {sortConfig.direction === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )}
                        </span>
                      )}
                    </button>

                    <Input
                      placeholder={`Filter ${col.header}...`}
                      className="h-8 text-xs"
                      onChange={(e) =>
                        handleFilter(col.accessor, e.target.value)
                      }
                    />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {selectedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              selectedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={`${row.id}-${String(col.accessor)}`}>
                      {col.render ? col.render(row) : String(row[col.accessor])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Page {page} of {nPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === nPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
