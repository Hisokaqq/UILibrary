import React, { createContext, useContext, useEffect, useState } from "react";

import type { Data } from "@/lib/mockData";
import { mockData } from "@/lib/mockData";

interface DataContextType {
  data: Data[];
  isLoading: boolean;
  addData: (newData: Omit<Data, "id">) => void;
  getById: (id: string) => Data | undefined;
  editData: (id: string, newData: Omit<Data, "id">) => void;
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

  const editData = (id: string, newData: Omit<Data, "id">) => {
    setData((prev) => {
      if (!prev) return prev;
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, ...newData };
        }
        return item;
      });
    });
  };

  const getById = (id: string) => {
    return data?.find((el) => el.id === id);
  };

  return (
    <DataContext.Provider
      value={{
        data: data || [],
        isLoading: loading,
        addData,
        getById,
        editData,
      }}
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
