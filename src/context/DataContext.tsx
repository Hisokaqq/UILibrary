import React, { createContext, useContext, useEffect, useState } from "react";

import type { Data } from "@/lib/mockData";
import { mockData } from "@/lib/mockData";

interface DataContextType {
  data: Data[];
  isLoading: boolean;
  addData: (newData: Omit<Data, "id">) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Data[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([...mockData(100)]);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const addData = (newData: Omit<Data, "id">) => {
    setData((prev) => {
      if (!prev) return prev;
      const newEntry: Data = {
        id: `evn-${prev.length + 1}`,
        ...newData,
      };
      return [...prev, newEntry];
    });
  };

  return (
    <DataContext.Provider
      value={{ data: data || [], isLoading: loading, addData }}
    >
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
