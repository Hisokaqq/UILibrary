import React from "react";
import { useData } from "@/context/DataContext";

const DataGrid = () => {
  const { data, isLoading } = useData();

  if (isLoading) return <div className="p-10">Loading data...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Events ({data.length})</h1>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded shadow">
            <span className="font-bold">{item.title}</span>
            <span className="text-gray-500 text-sm ml-2">({item.status})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataGrid;
