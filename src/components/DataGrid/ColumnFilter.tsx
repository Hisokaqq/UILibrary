import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";

interface ColumnFilterProps {
  allColumns: string[];
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
}

const ColumnFilter = ({
  allColumns,
  visibleColumns,
  setVisibleColumns,
}: ColumnFilterProps) => {
  const handleCheckedChange = (column: string, isChecked: boolean) => {
    if (isChecked) {
      setVisibleColumns([...visibleColumns, column]);
    } else {
      setVisibleColumns(visibleColumns.filter((c) => c !== column));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 flex">
          <Settings2 className="mr-2 h-4 w-4" />
          View Columns
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {allColumns.map((c) => {
          const isChecked = visibleColumns.includes(c);

          return (
            <DropdownMenuCheckboxItem
              key={c}
              checked={isChecked}
              onCheckedChange={(checked) => handleCheckedChange(c, checked)}
            >
              {c}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnFilter;
