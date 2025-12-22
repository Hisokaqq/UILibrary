/**
 * DataGrid Component
 *
 * A reusable, client-side data grid that supports sorting, filtering, pagination,
 * and column toggling.
 *
 * Requirements:
 * 1. The generic type T must have an `id` property (string or number).
 * 2. `columns` definitions must match keys in T or provide a custom `render` function.
 *
 * @template T - The type of data displayed in the grid. Must extend { id: string | number }.
 *
 * @param {T[]} data - The array of data objects to display.
 * @param {ColumnDef<T>[]} columns - Configuration for table columns.
 * @param {keyof T} defaultSort - The default column key to sort by on initial render.
 * @param {boolean} isLoading - If true, displays a loading spinner instead of data.
 * @param {number} pageSize - Number of rows per page.
 * @param {string} [className] - Optional Tailwind classes to merge into the container.
 *
 * @example
 * ```tsx
 * const columns = [
 * { accessor: "name", header: "Name" },
 * { accessor: "role", header: "Role", render: (user) => <b>{user.role}</b> }
 * ];
 *
 * <DataGrid
 * data={users}
 * columns={columns}
 * defaultSort="name"
 * isLoading={false}
 * pageSize={10}
 * />
 * ```
 */

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
import { ArrowUpDown, MoveDown, MoveUp } from "lucide-react";
import { cn } from "@/lib/utils";
import ColumnFilter from "./components/ColumnFilter";
import { Spinner } from "../ui/spinner";
import Pagination from "./components/Pagination";

export interface ColumnDef<T> {
  accessor: keyof T;
  header: string;

  render?: (item: T) => React.ReactNode;
}

interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  defaultSort: keyof T;
  isLoading: boolean;
  pageSize: number;
  className?: string;
}

const DataGrid = <T extends { id: string | number }>({
  data,
  columns,
  isLoading,
  className,
  defaultSort,
  pageSize,
}: DataGridProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({
    key: defaultSort,
    direction: "asc",
  });

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((c) => c.accessor as string)
  );

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
    setSortConfig((current) => {
      if (current.key !== key) {
        return { key, direction: "asc" };
      }

      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }

      return { key: defaultSort, direction: "asc" };
    });
  };

  const handleFilter = (key: keyof T, value: string) => {
    setFilters((prev) => ({ ...prev, [key as string]: value }));
    setPage(1);
  };

  const nPages = Math.ceil(visibleData.length / pageSize);
  const selectedData = visibleData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className={cn("space-y-4 flex flex-col", className)}>
      <div className="flex justify-end">
        <ColumnFilter
          allColumns={columns.map((c) => c.accessor as string)}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((c) => visibleColumns.includes(c.accessor as string))
                .map((c) => (
                  <TableHead key={String(c.accessor)}>
                    <div className="space-y-2 py-2">
                      <button
                        onClick={() => handleSort(c.accessor)}
                        className="font-bold hover:text-blue-600 transition duration-300 flex items-center gap-1"
                      >
                        {c.header}
                        {sortConfig.key === c.accessor ? (
                          <span>
                            {sortConfig.direction === "asc" ? (
                              <MoveUp size={16} />
                            ) : (
                              <MoveDown size={16} />
                            )}
                          </span>
                        ) : (
                          <ArrowUpDown size={16} />
                        )}
                      </button>

                      <Input
                        placeholder={`Filter ${c.header}...`}
                        className="h-8 text-xs"
                        onChange={(e) =>
                          handleFilter(c.accessor, e.target.value)
                        }
                      />
                    </div>
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-56">
                  <div className="flex items-center justify-center w-full h-full">
                    <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : selectedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-56 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              selectedData.map((row) => (
                <TableRow key={row.id}>
                  {columns
                    .filter((c) =>
                      visibleColumns.includes(c.accessor as string)
                    )
                    .map((c) => (
                      <TableCell key={`${row.id}-${String(c.accessor)}`}>
                        {c.render ? c.render(row) : String(row[c.accessor])}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination page={page} nPages={nPages} setPage={setPage} />
    </div>
  );
};

export default DataGrid;
