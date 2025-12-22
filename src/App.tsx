import { useData } from "./context/DataContext";
import DataGrid, { type ColumnDef } from "./components/DataGrid";
import { Badge } from "@/components/ui/badge";

import type { Data } from "@/lib/mockData";
import Timeline from "./components/Timeline";
import { CheckCircle2, CircleDashed, Pencil, Timer } from "lucide-react";
import { cn } from "./lib/utils";
import Nav from "./components/Nav";
import EventDialog from "./components/EventDialog";
import { Button } from "./components/ui/button";

function App() {
  const { data, isLoading } = useData();

  const columns: ColumnDef<Data>[] = [
    {
      accessor: "title",
      header: "Event Name",
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
      render: (row) => (
        <div className="flex justify-between items-center">
          {row.id}
          <EventDialog id={row.id}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="text-primary/50" />
            </Button>
          </EventDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-background/40 h-screen p-8 space-y-8">
      <Nav />

      <div className="bg-background p-6 rounded-xl border shadow-sm flex min-h-205 gap-4">
        <DataGrid
          data={data}
          columns={columns}
          className="w-3/4"
          isLoading={isLoading}
          defaultSort="date"
          pageSize={12}
        />
        <Timeline
          groupBy="date"
          header="Date"
          data={data}
          className="w-1/4 max-h-200"
          ariaLabel={(item) => {
            return `${item.title}, status is ${item.status}`;
          }}
          render={(item: Data, isSelected: boolean) => {
            const statusConfig = {
              pending: {
                icon: CircleDashed,
                color: "text-yellow-600 bg-yellow-50 border-yellow-200",
              },
              "in-progress": {
                icon: Timer,
                color: "text-blue-600 bg-blue-50 border-blue-200",
              },
              completed: {
                icon: CheckCircle2,
                color: "text-green-600 bg-green-50 border-green-200",
              },
            };

            const config = statusConfig[item.status];
            const Icon = config.icon;

            return (
              <div
                className={cn(
                  "flex gap-3 p-2 items-center rounded-sm transition-all duration-200",
                  isSelected ? "bg-blue-100 border-blue-200" : "bg-muted/10"
                )}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${config.color}`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                </div>

                <div className="flex-1  gap-5 flex justify-between">
                  <p className="font-semibold text-primary leading-none">
                    {item.title}
                  </p>

                  <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                    {item.id}
                  </p>
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

export default App;
