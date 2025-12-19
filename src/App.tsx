import { useData } from "./context/DataContext";
import { DataGrid, type ColumnDef } from "./components/DataGrid";
import { Badge } from "@/components/ui/badge";

import type { Data } from "@/lib/mockData";
import { Spinner } from "./components/ui/spinner";
import Timeline from "./components/Timeline";

function App() {
  const { data, isLoading } = useData();

  const columns: ColumnDef<Data>[] = [
    {
      accessor: "title",
      header: "Task Name",
    },
    {
      accessor: "date",
      header: "Due Date",
    },
    {
      accessor: "status",
      header: "Status",
      render: (row) => {
        const colors = {
          pending:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
          "in-progress":
            "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
          completed:
            "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
        };

        return (
          <Badge className={`${colors[row.status]} border shadow-none`}>
            {row.status}
          </Badge>
        );
      },
    },
    {
      accessor: "id",
      header: "ID",
    },
  ];

  return (
    <div className="bg-gray-50 h-screen p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
      </div>

      {isLoading ? (
        <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex min-h-205 gap-4">
          <DataGrid data={data} columns={columns} className="w-3/4" />
          <Timeline />
        </div>
      )}
    </div>
  );
}

export default App;
